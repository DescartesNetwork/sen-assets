import {
  CHAIN_ID_SOLANA,
  getIsTransferCompletedSolana,
  getOriginalAssetEth,
  parseSequenceFromLogEth,
} from '@certusone/wormhole-sdk'
import { account, utils } from '@senswap/sen-js'
import { ethers } from 'ethers'

import {
  StepTransfer,
  WohTokenInfo,
  TransactionEtherInfo,
  TransferData,
  TransferState,
} from 'app/constant/types/wormhole'
import {
  createEtherSolContext,
  getEtherContext,
  getSolContext,
} from '../context'
import { ABI_TOKEN_IMPLEMENTATION } from 'app/lib/wormhole/constant/abis'
import { Moralis } from './moralis'
import { DataLoader } from 'shared/dataloader'
import { web3Http } from 'app/lib/etherWallet/web3Config'
import { getEmitterAddressEth } from '@certusone/wormhole-sdk'
import { getSignedVAA } from '@certusone/wormhole-sdk'
import { getForeignAssetSolana } from '@certusone/wormhole-sdk'
import { getAssociatedAddress } from './utils'

const abiDecoder = require('abi-decoder')

export const fetchTokenEther = async (
  address: string,
): Promise<WohTokenInfo[]> => {
  const tokens = []
  const data = await Moralis.fetchTokens(address)
  // parser token
  for (const token of data) {
    token.decimals = Number(token.decimals)
    token.balance = BigInt(token.balance)
    token.amount = utils.undecimalize(token.balance, token.decimals)
    token.address = token.token_address
    tokens.push(token)
  }
  return tokens
}

export const fetchTransactionEtherAddress = async (
  address: string,
): Promise<TransactionEtherInfo[]> => {
  const data = Moralis.fetchTransactions(address)
  return data
}

export const fetchEtherTokenInfo = async (
  address: string,
): Promise<WohTokenInfo> => {
  const data = await Moralis.fetchInfoAToken(address)
  return {
    balance: '',
    decimals: data?.decimals,
    logo: data?.logo,
    name: data?.name,
    symbol: data?.symbol,
    address: data?.address,
    amount: data?.amount,
  }
}

export const fetchEtherSolHistory = async (
  address: string,
): Promise<TransferState[]> => {
  const etherContext = getEtherContext()
  const history: TransferState[] = []
  let transactions = await fetchTransactionEtherAddress(address)
  const transferData = await Promise.all(
    transactions.map(async (trans) => {
      if (trans.to_address !== etherContext.tokenBridgeAddress) return
      const transferState = await createTransferState(trans)
      return transferState
    }),
  )
  for (const data of transferData) {
    if (data) history.push(data)
  }
  return history
}

const parseTransParam = async (trans: TransactionEtherInfo) => {
  abiDecoder.addABI(ABI_TOKEN_IMPLEMENTATION)
  const transParams: { name: string; type: string; value: string }[] =
    abiDecoder.decodeMethod(trans.input)?.params
  if (!transParams) return
  // parse token
  const tokenAddr = transParams[0]?.value
  if (!tokenAddr) return
  // parse recipientChain
  if ((await isCurrentSolAddress(transParams, tokenAddr)) === false) {
    return
  }
  const amount = transParams[1]?.value
  const targetChainInput = transParams[2]?.value
  if (!amount || !targetChainInput) return
  return {
    amount,
    token: tokenAddr,
    targetChain: Number(targetChainInput),
  }
}

export const createTransferState = async (
  trans: TransactionEtherInfo,
): Promise<TransferState | undefined> => {
  const params = await parseTransParam(trans)
  if (!params || params.targetChain !== CHAIN_ID_SOLANA) return

  const tokenInfo = await DataLoader.load(
    'fetchEtherTokenInfo' + params.token,
    () => fetchEtherTokenInfo(params.token),
  )
  const context = createEtherSolContext(tokenInfo)
  context.time = new Date(trans.block_timestamp).getTime()
  const transferData: TransferData = {
    nextStep: StepTransfer.Unknown,
    amount: utils.undecimalize(BigInt(params.amount), tokenInfo.decimals),
    from: trans.from_address,
    to: '',
    emitterAddress: '',
    sequence: '',
    vaaHex: '',
    txId: '',
    txHash: trans.hash,
  }
  return {
    context,
    transferData,
  }
}

export const restoreEther = async (
  state: TransferState,
): Promise<TransferState> => {
  const cloneState: TransferState = JSON.parse(JSON.stringify(state))
  const { transferData, context } = cloneState
  const txHash = transferData.txHash
  if (!txHash) throw new Error('Invalid txHash')

  const value = await web3Http.eth.getTransactionReceipt(txHash)
  const sequence = parseSequenceFromLogEth(
    value,
    state.context.srcBridgeAddress,
  )

  transferData.sequence = sequence
  transferData.emitterAddress = getEmitterAddressEth(
    context.srcTokenBridgeAddress,
  )

  try {
    const { vaaBytes } = await getSignedVAA(
      context.wormholeRpc,
      context.srcChainId,
      getEmitterAddressEth(context.srcTokenBridgeAddress),
      sequence,
    )
    transferData.vaaHex = Buffer.from(vaaBytes).toString('hex')
    const isRedeemed = await getIsTransferCompletedSolana(
      context.targetTokenBridgeAddress,
      vaaBytes,
      window.sentre.splt.connection,
    )
    if (isRedeemed) transferData.nextStep = StepTransfer.Finish
    else transferData.nextStep = StepTransfer.WaitSigned
  } catch (error) {
    transferData.nextStep = StepTransfer.WaitSigned
  }
  return cloneState
}

const isCurrentSolAddress = async (
  transParams: { name: string; type: string; value: string }[],
  tokenAddr: string,
): Promise<Boolean> => {
  if (transParams.length !== 6) return false
  const solAddr = await DataLoader.load(
    'getSolAssociatedAddress' + tokenAddr,
    () => getSolReceipient(tokenAddr),
  )
  return transParams[3].value === solAddr
}

const getSolReceipient = async (tokenEtherAddr: string) => {
  const wrapTokenAddr = await getWrappedMintAddress(tokenEtherAddr)
  const solWallet = window.sentre.wallet
  if (!wrapTokenAddr || !solWallet) return null
  const dstAddress = await getAssociatedAddress(wrapTokenAddr, solWallet)
  return ethers.utils.hexlify(account.fromAddress(dstAddress).toBuffer())
}

const getWrappedMintAddress = async (tokenEtherAddr: string) => {
  const etherWallet = window.wormhole.sourceWallet.ether
  if (!etherWallet) throw new Error('Login fist')
  const provider = await etherWallet.getProvider()
  const etherContext = getEtherContext()
  const originAsset = await getOriginalAssetEth(
    etherContext.tokenBridgeAddress,
    provider,
    tokenEtherAddr,
    etherContext.chainId,
  )
  const solContext = getSolContext()
  const wrappedMintAddress = await getForeignAssetSolana(
    window.sentre.splt.connection,
    solContext.tokenBridgeAddress,
    originAsset.chainId,
    originAsset.assetAddress,
  )
  return wrappedMintAddress
}

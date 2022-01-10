import {
  CHAIN_ID_SOLANA,
  getIsTransferCompletedSolana,
  getOriginalAssetEth,
  parseSequenceFromLogEth,
} from '@certusone/wormhole-sdk'
import { account, utils } from '@senswap/sen-js'
import { ethers } from 'ethers'
import { getEmitterAddressEth } from '@certusone/wormhole-sdk'
import { getSignedVAA } from '@certusone/wormhole-sdk'
import { getForeignAssetSolana } from '@certusone/wormhole-sdk'

import {
  StepTransfer,
  WohTokenInfo,
  TransactionEtherInfo,
  TransferData,
  TransferState,
  RawEtherTransaction,
} from 'app/constant/types/wormhole'
import {
  createEtherSolContext,
  getEtherContext,
  getSolContext,
} from '../context'
import { ABI_TOKEN_IMPLEMENTATION } from 'app/lib/wormhole/constant/abis'
import { Moralis } from './moralis'
import { DataLoader } from 'shared/dataloader'
import { web3Http, web3WormholeContract } from 'app/lib/etherWallet/web3Config'
import { WETH_ADDRESS } from '../constant/ethConfig'
import { getEtherNetwork } from './utils'

const abiDecoder = require('abi-decoder')

type ParsedTransaction = {
  targetChain: number
  amount: string
  token?: string
}
type TransParam = { name: string; type: string; value: string }

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

  const ethAddress = await window.wormhole.sourceWallet.ether?.getAddress()
  let ethBalance = BigInt(0)
  if (ethAddress) ethBalance = await web3Http.eth.getBalance(ethAddress)

  const ethDecimals = 18
  const weth: any = {
    balance: ethBalance,
    decimals: ethDecimals,
    logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs/logo.png',
    name: 'Ethereum',
    symbol: 'ETH',
    token_address: WETH_ADDRESS[getEtherNetwork()],
    address: WETH_ADDRESS[getEtherNetwork()],
    amount: utils.undecimalize(ethBalance, ethDecimals),
  }
  return [weth, ...tokens]
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
  leftTrx?: RawEtherTransaction[],
  fromBLK?: number,
  fetchedDays?: number,
): Promise<{
  history: TransferState[]
  leftTransaction: RawEtherTransaction[]
  fromBlock: number
  count: number
}> => {
  const history: TransferState[] = []
  let { transactions, leftTransaction, count, fromBlock } =
    await fetchTransactionEtherAddress(address, leftTrx, fromBLK, fetchedDays)
  const transferData = await Promise.all(
    transactions.map(async (trans) => {
      const transferState = await createTransferState(trans)
      return transferState
    }),
  )
  for (const data of transferData) {
    if (data) history.push(data)
  }
  return { history, leftTransaction, count, fromBlock }
}

const parseTransParam = async (
  trans: TransactionEtherInfo,
): Promise<ParsedTransaction | undefined> => {
  abiDecoder.addABI(ABI_TOKEN_IMPLEMENTATION)
  const { name, params: transParams }: { name: string; params: TransParam[] } =
    abiDecoder.decodeMethod(trans.input)

  if (!transParams || !name) return
  // parse token
  const tokenAddr = transParams.find((item) => item.name === 'token')?.value
  const amount = transParams.find((item) => item.name === 'amount')?.value
  const targetChainInput = transParams.find(
    (item) => item.name === 'recipientChain',
  )?.value

  if (!targetChainInput) return
  if (name === 'wrapAndTransferETH' || !amount) {
    return {
      amount: trans.value,
      targetChain: Number(targetChainInput),
    }
  }
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

  let tokenInfo: WohTokenInfo = {
    balance: params.amount,
    decimals: 18,
    logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs/logo.png',
    name: 'Ethereum',
    symbol: 'ETH',
    address: 'string',
    amount: Number(params.amount),
  }
  const token = params.token
  if (token) {
    tokenInfo = await DataLoader.load(
      'fetchEtherTokenInfo' + params.token,
      () => fetchEtherTokenInfo(token),
    )
  }

  const solWallet = await window.sentre.wallet?.getAddress()
  if (!solWallet) throw new Error('Wallet is not connected')

  const context = createEtherSolContext(tokenInfo)
  const block = await web3Http.eth.getBlock(trans.blockNumber)
  context.time = new Date(block.timestamp * 1000).getTime()
  const transferData: TransferData = {
    nextStep: StepTransfer.Unknown,
    amount: utils.undecimalize(BigInt(params.amount), tokenInfo.decimals),
    from: trans.from,
    to: solWallet,
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

const getSolReceipient = async (tokenEtherAddr: string) => {
  const wrapTokenAddr = await DataLoader.load(
    'getWrappedMintAddress' + tokenEtherAddr,
    () => getWrappedMintAddress(tokenEtherAddr),
  )
  const solWallet = window.sentre.wallet
  if (!wrapTokenAddr || !solWallet) return null
  const walletAddress = await solWallet.getAddress()
  const { splt } = window.sentre
  const dstAddress = await splt.deriveAssociatedAddress(
    walletAddress,
    wrapTokenAddr,
  )
  return ethers.utils.hexlify(account.fromAddress(dstAddress).toBuffer())
}

const getWrappedMintAddress = async (tokenEtherAddr: string) => {
  const etherWallet = window.wormhole.sourceWallet.ether
  if (!etherWallet) throw new Error('Wallet is not connected')
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

export const isTrxWithSol = async (
  trans: RawEtherTransaction,
): Promise<boolean> => {
  const tokenEtherAddr = `0x${trans.raw.data.slice(412, 452)}`
  const receipient = `0x${trans.raw.data.slice(456, 520)}`
  if (receipient.length < 66) return false
  const solCurrentReceipient = await getSolReceipient(tokenEtherAddr)
  return receipient === solCurrentReceipient
}

export const fetchTransactionEtherAddress = async (
  address: string,
  leftTrx?: RawEtherTransaction[],
  fromBLK?: number,
  fetchedDays?: number,
): Promise<{
  transactions: TransactionEtherInfo[]
  leftTransaction: RawEtherTransaction[]
  fromBlock: number
  count: number
}> => {
  const currentBlockNumber = (await web3Http.eth.getBlockNumber()) as number
  const transactions: TransactionEtherInfo[] = []
  let leftTransaction: RawEtherTransaction[] = []
  let fromBlock: number = fromBLK ? fromBLK - 6371 : currentBlockNumber - 6371
  let toBlock: number = fromBlock + 6371
  let count: number = fetchedDays ? fetchedDays : 0

  if (leftTrx?.length) {
    let isStop = false
    await Promise.all(
      leftTrx.map(async (tempTransaction) => {
        if (transactions.length >= 4) isStop = true
        if (isStop) return
        const isTrxSol = await isTrxWithSol(tempTransaction)
        if (isTrxSol === false) return

        const value = await web3Http.eth.getTransaction(
          tempTransaction.transactionHash,
        )
        if (value.from.toLowerCase() === address) {
          transactions.push(value)
          let index = leftTrx.indexOf(tempTransaction)
          if (index > -1) {
            leftTrx.splice(index, 1)
          }
        }
      }),
    )
    leftTransaction = leftTrx
    if (transactions.length > 5) {
      fromBlock += 6371
      return { transactions, leftTransaction, fromBlock, count }
    }
  }

  while (transactions.length < 5 && count < 30) {
    const tempTransactions: RawEtherTransaction[] =
      await web3WormholeContract.getPastEvents(
        'LogMessagePublished',
        {
          fromBlock,
          toBlock,
        },
        function (error: any, events: any) {},
      )
    await Promise.all(
      tempTransactions.map(async (tempTransaction) => {
        let isStop = false
        if (transactions.length >= 5) isStop = true
        if (isStop) return
        const isTrxSol = await isTrxWithSol(tempTransaction)
        if (isTrxSol === false) return

        const value = await web3Http.eth.getTransaction(
          tempTransaction.transactionHash,
        )
        if (value.from.toLowerCase() === address) {
          transactions.push(value)
          let index = tempTransactions.indexOf(tempTransaction)
          if (index > -1) {
            tempTransactions.splice(index, 1)
          }
        }
      }),
    )
    leftTransaction = tempTransactions.map((trx) => {
      // ReturnValues is a non-serializable data, so it must be removed
      delete trx.returnValues
      return { ...trx }
    })
    if (transactions.length < 5) {
      toBlock = fromBlock
      fromBlock -= 6371
      count++
    }
  }
  return { transactions, leftTransaction, fromBlock, count }
}

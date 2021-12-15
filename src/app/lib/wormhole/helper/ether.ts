import {
  CHAIN_ID_SOLANA,
  getClaimAddressSolana,
  getIsTransferCompletedSolana,
  hexToNativeString,
  parseSequenceFromLogEth,
} from '@certusone/wormhole-sdk'
import { utils } from '@senswap/sen-js'
import { ethers } from 'ethers'

import {
  StepTransfer,
  WohTokenInfo,
  TransactionEtherInfo,
  TransferData,
  TransferState,
} from 'app/constant/types/wormhole'
import { createEtherSolContext, getEtherContext } from '../context'
import { ABI_TOKEN_IMPLEMENTATION } from 'app/constant/abis'
import { Moralis } from './moralis'
import { DataLoader } from 'shared/dataloader'
import { web3Http } from 'app/lib/etherWallet/web3Config'
import { getEmitterAddressEth } from '@certusone/wormhole-sdk'
import { getSignedVAA } from '@certusone/wormhole-sdk'

const abiDecoder = require('abi-decoder')

type TransParam = {
  targetChain: number
  amount: string
  token: string
}

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

// export const fetchTransactions = async () => {
//   console.log('Hello')
//   console.log(
//     getEmitterAddressEth('0x04b0dd4036faae6e1da014a123563c210a8b03b7'),
//     '0x04b0dd4036faae6e1da014a123563c210a8b03b7',
//   )
//   web3WormholeContract.events
//     .allEvents(
//       {
//         fromBlock: 0,
//       },
//       function (error: any, event: any) {
//         console.log(event)
//       },
//     )
//     .on('connected', function (subscriptionId: any) {
//       console.log(subscriptionId)
//     })
//     .on('data', function (event: any) {
//       console.log(event) // same results as the optional callback above
//     })
//     .on('changed', function (event: any) {
// remove event from local database
// console.log(event)
// })
// .on('error', function (error: any, receipt: any) {
// If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
//   console.log(error, receipt)
// })
// web3WormholeContract.events.allEv
//   .getPastLogs({
//     fromBlock: '13797328',
//     address: '0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B',
//   })
//   .then((res: any) => {
//     console.log(res)
//   })
//   .catch((err: any) => console.log('getPastLogs failed', err))
// parser token
// for (const token of data) {
//   token.decimals = Number(token.decimals)
//   token.balance = BigInt(token.balance)
//   token.amount = utils.undecimalize(token.balance, token.decimals)
//   token.address = token.token_address
//   tokens.push(token)
// }
// return tokens
// }

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

const parseTransParam = (
  trans: TransactionEtherInfo,
): TransParam | undefined => {
  abiDecoder.addABI(ABI_TOKEN_IMPLEMENTATION)
  const transParams: { name: string; type: string; value: string }[] =
    abiDecoder.decodeMethod(trans.input)?.params
  if (!transParams) return
  // parse token
  if (transParams.length === 6) {
    const u8arr = ethers.utils.arrayify(transParams[3].value)
  }
  const tokenAddr = transParams[0]?.value
  if (!tokenAddr) return
  // parse recipientChain
  const amount = transParams[1]?.value
  const targetChainInput = transParams[2]?.value
  if (!amount || !targetChainInput) return
  return {
    amount,
    token: tokenAddr,
    targetChain: Number(targetChainInput),
  }
}

// export const getClaimSolana = async (transParams: { name: string; type: string; value: string }[]) => {
//   const context =
//   if (transParams.length === 6) {
//     const vaaHex = await getSignedVAA(

//     )
//     console.log(
//       getClaimAddressSolana(
//         '0x8239d86fdda17f0152c29256022f9cbb411e7a149884d5042ea79f0832c4dda1',

//       ),
//       transParams[3].value,
//     )
//   }
// }

export const createTransferState = async (
  trans: TransactionEtherInfo,
): Promise<TransferState | undefined> => {
  const params = parseTransParam(trans)
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

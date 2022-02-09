import { ChainId } from '@certusone/wormhole-sdk'

export type WohTokenInfo = {
  balance: number
  decimals: number
  logo: string
  name: string
  symbol: string
  address: string
  amount?: number
}

export type TransactionDataPerAddress = {
  page: number
  page_size: number
  result: TransactionEtherInfo[]
  total: number
}

export type TransactionEtherInfo = {
  blockHash: string | null
  blockNumber: number | null
  block_timestamp?: string
  from: string
  gas: number
  gasPrice: string
  hash: string
  input: string
  nonce: number
  receipt_contract_address?: string
  receipt_cumulative_gas_used?: string
  receipt_gas_used?: string
  receipt_root?: string
  receipt_status?: string
  to: string | null
  transactionIndex: number | null
  value: string
}

export type TransactionSolanaInfo = {
  blockHash: string | null
  blockNumber: number | null
  block_timestamp?: string
  from: string
  gas: number
  gasPrice: string
  hash: string
  input: string
  nonce: number
  receipt_contract_address?: string
  receipt_cumulative_gas_used?: string
  receipt_gas_used?: string
  receipt_root?: string
  receipt_status?: string
  to: string | null
  transactionIndex: number | null
  value: string
}

export type RawEtherTransaction = {
  address: string
  blockHash: string
  blockNumber: number
  event: string
  id?: string
  logIndex: number
  raw: RawLog
  removed?: string
  returnValues?: LogDetail
  signature: string
  transactionHash: string
  transactionIndex: number
}

export type RawLog = {
  data: string
  topics: string[]
}

export type LogDetail = {
  [key: string]: any
}

export type InputEtherTransaction = {
  name: string
  params: InputDetail[]
}

export type InputDetail = {
  name: string
  type: string
  value: string
}

export enum WormholeStoreKey {
  Transfer = 'Transfer',
  Provider = 'Provider',
  SourceWallet = 'SourceWallet',
}
export type WormholeStatus = 'pending' | 'failed' | 'success' | 'unknown'

// Transfer
export enum StepTransfer {
  Transfer = 'Transfer',
  WaitSigned = 'WaitSigned',
  Redeem = 'Redeem',
  Finish = 'Finish',
  Unknown = 'Unknown',
}

export type TransferData = {
  nextStep: StepTransfer
  amount: string
  from: string
  to: string
  sequence: string
  emitterAddress: string
  txHash: string
  vaaHex: string
  txId: string
}

export type AttestData = {
  step: number
  sequence: string
  emitterAddress: string
  vaaHex: string
  txId: string
}

export type TransferState = {
  context: WormholeContext
  transferData: TransferData
  attestData?: AttestData
}

export type WormholeContext = {
  id: string
  time: number
  // Source network
  srcChainId: ChainId
  srcTokenBridgeAddress: string
  srcBridgeAddress: string
  // Sol network
  targetChainId: ChainId
  targetTokenBridgeAddress: string
  targetBridgeAddress: string
  // Wormhole
  wormholeRpc: string
  // Token
  tokenInfo: WohTokenInfo
}

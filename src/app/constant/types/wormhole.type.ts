import { ChainId } from '@certusone/wormhole-sdk'

export type TokenInfo = {
  balance: string
  decimals: number
  logo: string
  name: string
  symbol: string
  address: string
  amount: number
}

export type TransactionDataPerAddress = {
  page: number
  page_size: number
  result: TransactionEtherInfo[]
  total: number
}

export type TransactionEtherInfo = {
  block_hash: string
  block_number: string
  block_timestamp: string
  from_address: string
  gas: string
  gas_price: string
  hash: string
  input: InputEtherTransaction
  nonce: string
  receipt_contract_address: string
  receipt_cumulative_gas_used: string
  receipt_gas_used: string
  receipt_root: string
  receipt_status: string
  to_address: string
  transaction_index: string
  value: string
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

export type State = {
  // source wallet
  sourceTokens: Record<string, TokenInfo>
  sourceChain: ChainId
  sourceWalletAddress: string
  // target wallet
  targetWalletAddress: string
  targetChain: ChainId
  // other
  tokenAddress: string
  amount: string
  processId: string
  visible: boolean
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
  tokenInfo: TokenInfo
}

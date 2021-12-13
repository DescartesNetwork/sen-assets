import { TransferData, TransferState, WormholeContext } from './wormhole.type'
/**
 * Interface & Utility
 */

export type State = {
  transaction: TransactionTransferHistoryData[]
  wormhole: TransferState[]
}

/**
 * Store constructor
 */
export type HistoryWormhole = {
  context: WormholeContext
  transfer: TransferData
}
export type TransactionTransferHistoryData = {
  time: string
  transactionId: string
  from: string
  to: string
  amount: number
  key: string
  mint: string
  isReceive: boolean
}

import { TokenInfo } from '@solana/spl-token-registry'
export const DATA_SIZE_POOL_SCHEMA = 241
export const OFFSET_TAXMAN_COMPARE = 65
export const TRANSLOG_PROGRAM_DATA_SCHEMA = { key: 'code', type: 'u8' }
export const MAX_LIMIT = 100
export const DEFAULT_LIMIT = 25
export const SECOND_WAIT_COLLECTING = 60000
export const STAT_DATE_RANGE = 10
export const LPT_DECIMALS = 9

export const DEFAULT_TOKEN_INFO: TokenInfo = {
  address: '',
  chainId: 0,
  decimals: 0,
  name: '',
  symbol: 'TOKEN',
  extensions: undefined,
  logoURI: '',
  tags: [],
}

export const DEFAULT_COLLECT_OPTIONS: JobCollectOption = {
  TransLog: true,
  DailyReport: true,
  SummaryReport: true,
}

export enum SwapActionType {
  InitPool = 'INITIALIZE_POOL',
  AddLiquidity = 'ADD_LIQUIDITY',
  RemoveLiquidity = 'REMOVE_LIQUIDITY',
  Swap = 'SWAP',
}

export enum FarmingActionType {
  InitFarm = 'INITIALIZE_FARM',
  Stake = 'STAKE',
  Unstake = 'UNSTAKE',
}

export enum ParsedType {
  Transfer = 'transfer',
}
export type TransLogProgramData = {
  code: number
}

export type JobCollectOption = {
  TransLog?: boolean
  DailyReport?: boolean
  SummaryReport?: boolean
}
export type ParsedAction = {
  type: ParsedType
  info: ParsedInfoTransfer
}
export type ParsedInfoTransfer = {
  source: string
  destination: string
  amount: string
  lamports: number
}

export type TotalFarmSummary = {
  ttl: number
  stake: number
  unstake: number
}

export type OptionsFetchSignature = {
  limit?: number
  lastSignature?: string
  secondFrom?: number
  secondTo?: number
}

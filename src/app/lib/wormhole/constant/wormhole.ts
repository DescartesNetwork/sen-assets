import { ChainId, CHAIN_ID_ETH, CHAIN_ID_SOLANA } from '@certusone/wormhole-sdk'
import { WormholeContext } from '../context'
import { SolAddressConfig } from './solConfig'

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

// wormhole network
export const WORMHOLE_RPC_HOST: SolAddressConfig = {
  mainnet: 'https://wormhole-v2-mainnet-api.certus.one',
  testnet: '',
  devnet: 'https://wormhole-v2-testnet-api.certus.one',
}

export const WORMHOLE_NETWORK: {
  chainID: ChainId
  name: string
  logo: string
}[] = [
  {
    chainID: CHAIN_ID_SOLANA,
    name: 'Solana',
    logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
  },
  {
    chainID: CHAIN_ID_ETH,
    name: 'Ethereum',
    logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/2FPyTwcZLUg1MDrwsyoP4D6s1tM7hAkHYRjkNb5w6Pxk/logo.png',
  },
]

export const WOH_WALLET = 'WohWallet'
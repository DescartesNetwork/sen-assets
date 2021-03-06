import { ChainId, CHAIN_ID_ETH, CHAIN_ID_SOLANA } from '@certusone/wormhole-sdk'
import { SolAddressConfig } from './solConfig'

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

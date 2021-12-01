import { ChainId } from '@certusone/wormhole-sdk'

export const WORMHOLE_NETWORK: {
  chainID: ChainId
  name: string
  icon: string
}[] = [
  {
    chainID: 1,
    name: 'Solana',
    icon: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
  },
  {
    chainID: 2,
    name: 'Ethereum',
    icon: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
  },
]

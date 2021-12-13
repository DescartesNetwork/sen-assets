export type EtherNetwork = 'mainnet' | 'goerli'

export type EthAddressConfig = {
  mainnet: string
  goerli: string
  ropsten: string
}

export type EthChainIdConfig = {
  mainnet: number
  goerli: number
  ropsten: number
}

export type EtherConfigSet = {
  mainnet: string
  goerli: string
  ropsten: string
}

export type MoralisStructure = {
  url: string
  apiKey: string
}

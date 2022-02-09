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

export type EtherNetwork = 'mainnet' | 'goerli'

export type EtherConfigSet = {
  mainnet: string
  goerli: string
  ropsten: string
}

export type MoralisStructure = {
  url: string
  apiKey: string
}

export const AVERAGE_BLOCK_PER_DAY = 6371
export const MAX_QUERIRED_DAYS = 30

export const ETH_BRIDGE_ADDRESS: EthAddressConfig = {
  mainnet: '0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B',
  goerli: '0x706abc4E45D419950511e474C7B9Ed348A4a716c',
  ropsten: '0xC89Ce4735882C9F0f0FE26686c53074E09B0D550',
}

export const ETH_TOKEN_BRIDGE_ADDRESS: EthAddressConfig = {
  mainnet: '0x3ee18B2214AFF97000D974cf647E7C347E8fa585',
  goerli: '0xf890982f9310df57d00f659cf4fd87e65aded8d7',
  ropsten: '0x0290FB167208Af455bB137780163b7B7a9a10C16',
}

export const CHAIN_ID_ETH: EthChainIdConfig = {
  mainnet: 1,
  goerli: 5,
  ropsten: 3,
}

export const MORALIS_INFO: MoralisStructure = {
  url: 'https://deep-index.moralis.io/api/v2',
  apiKey: 'N6yeIUl1FxCPZWbXyxLHWPAjSr6ahQeJTX3d19pSKCwHsLCzpWE7z1hilon4xDOd',
}

export const INFURA_PROJECT_ID: String = '5eb1b92f2065414d9dd21858fac54257'
export const INFURA_SECRET_KEY: String = 'ff3fa1218f644c85a7374e40014374f1'

export const INFURA_PROJECT_ID_FOR_ETHERS: String =
  '25599d49923545c7a7f823b2680bc472'
export const INFURA_SECRET_KEY_FOR_ETHERS: String =
  '87c55f20d33d4b209a33d875a4a47d31'

export const INFURA_API_HTTP_URL: EtherConfigSet = {
  mainnet: `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
  goerli: `https://goerli.infura.io/v3/${INFURA_PROJECT_ID}`,
  ropsten: `https://ropsten.infura.io/v3/${INFURA_PROJECT_ID}`,
}

export const INFURA_API_WSS_URL: EtherConfigSet = {
  mainnet: `wss://mainnet.infura.io/ws/v3/${INFURA_PROJECT_ID}`,
  goerli: `wss://goerli.infura.io/ws/v3/${INFURA_PROJECT_ID}`,
  ropsten: `wss://ropsten.infura.io/ws/v3/${INFURA_PROJECT_ID}`,
}

export const WETH_ADDRESS: EthAddressConfig = {
  mainnet: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  goerli: '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6',
  ropsten: '0xc778417e063141139fce010982780140aa0cd5ab',
}

export const MAINNET_ETHER_ADDRESS_PREFIX = '0x1'
export const GOERLI_ETHER_ADDRESS_PREFIX = '0x5'

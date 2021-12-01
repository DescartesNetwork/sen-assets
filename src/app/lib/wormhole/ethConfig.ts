export type EthAddressConfig = {
  mainnet: string
  goerli: string
  ropsten: string
}

export const ETH_BRIDGE_ADDRESS: EthAddressConfig = {
  mainnet: '0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B',
  goerli: '0x706abc4E45D419950511e474C7B9Ed348A4a716c',
  ropsten: '0xC89Ce4735882C9F0f0FE26686c53074E09B0D550',
}

export const ETH_TOKEN_BRIDGE_ADDRESS: EthAddressConfig = {
  mainnet: '0x3ee18B2214AFF97000D974cf647E7C347E8fa585',
  goerli: '0xF890982f9310df57d00f659cf4fd87e65adEd8d7',
  ropsten: '0x0290FB167208Af455bB137780163b7B7a9a10C16',
}

export const TOKEN_ADDRESS: EthAddressConfig = {
  mainnet: '',
  goerli: '0xBA62BCfcAaFc6622853cca2BE6Ac7d845BC0f2Dc',
  ropsten: '0xef75e34c50c1b109fe65ee696f12225de508b9f2',
}

export type EthChainIdConfig = {
  mainnet: number
  goerli: number
  ropsten: number
}

export const CHAIN_ID_ETH: EthChainIdConfig = {
  mainnet: 1,
  goerli: 5,
  ropsten: 3,
}

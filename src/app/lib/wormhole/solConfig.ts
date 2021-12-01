export type SolAddressConfig = {
  mainnet: string
  testnet: string
  devnet: string
}

export const WORMHOLE_RPC_HOST: SolAddressConfig = {
  mainnet: 'https://wormhole-v2-mainnet-api.certus.one',
  testnet: '',
  devnet: 'https://wormhole-v2-testnet-api.certus.one',
}

export const SOL_RPC_HOST: SolAddressConfig = {
  mainnet: 'https://api.mainnet-beta.solana.com',
  testnet: 'https://api.testnet.solana.com',
  devnet: 'https://api.devnet.solana.com',
}

export const SOL_BRIDGE_ADDRESS: SolAddressConfig = {
  mainnet: 'worm2ZoG2kUd4vFXhvjh93UUH596ayRfgQ2MgjNMTth',
  testnet: 'Brdguy7BmNB4qwEbcqqMbyV5CyJd2sxQNUn6NEpMSsUb',
  devnet: '3u8hJUVTA4jH1wYAyUur7FFZVQ8H635K3tSHHF4ssjQ5',
}

export const SOL_TOKEN_BRIDGE_ADDRESS: SolAddressConfig = {
  mainnet: 'wormDTUJ6AWPNvk59vGQbDvGJmqbDTdgWgAqcLBCgUb',
  testnet: 'A4Us8EhCC76XdGAN17L4KpRNEK423nMivVHZzZqFqqBg',
  devnet: 'DZnkkTmCiFWfYTfT41X3Rd1kDgozqzxWaHqsw6W4x2oe',
}

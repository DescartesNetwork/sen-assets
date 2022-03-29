import { Net } from 'shared/runtime'

/**
 * Contructor
 */
type Conf = {
  node: string
  sntrAddress: string
}

const conf: Record<Net, Conf> = {
  /**
   * Development configurations
   */
  devnet: {
    node: 'https://api.devnet.solana.com',
    sntrAddress: '5YwUkPdXLoujGkZuo9B4LsLKj3hdkDcfP4derpspifSJ',
  },

  /**
   * Staging configurations
   */
  testnet: {
    node: 'https://api.testnet.solana.com',
    sntrAddress: '',
  },

  /**
   * Production configurations
   */
  mainnet: {
    node: 'https://api.mainnet-beta.solana.com',
    sntrAddress: 'SENBBKVCM7homnf5RX9zqpf1GFe935hnbU4uVzY1Y6M',
  },
}

/**
 * Module exports
 */
export default conf

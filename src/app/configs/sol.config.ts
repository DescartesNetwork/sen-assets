import { Net } from 'shared/runtime'
import { Utility } from '@sentre/utility'
import metaplexNFT from 'app/lib/metaplex'
import SafeWallet from 'app/helper/safeWallet'

/**
 * Contructor
 */
type Conf = {
  node: string
  sntrAddress: string
  metaplexNFT: metaplexNFT
  utility: Utility
}

const conf: Record<Net, Conf> = {
  /**
   * Development configurations
   */
  devnet: {
    node: 'https://api.devnet.solana.com',
    sntrAddress: '5YwUkPdXLoujGkZuo9B4LsLKj3hdkDcfP4derpspifSJ',
    metaplexNFT: new metaplexNFT('devnet'),
    utility: new Utility(new SafeWallet(), 'https://api.devnet.solana.com'),
  },

  /**
   * Staging configurations
   */
  testnet: {
    node: 'https://api.testnet.solana.com',
    sntrAddress: '',
    metaplexNFT: new metaplexNFT('testnet'),
    utility: new Utility(new SafeWallet(), 'https://api.testnet.solana.com'),
  },

  /**
   * Production configurations
   */
  mainnet: {
    node: 'https://api.mainnet-beta.solana.com',
    sntrAddress: 'SENBBKVCM7homnf5RX9zqpf1GFe935hnbU4uVzY1Y6M',
    metaplexNFT: new metaplexNFT('mainnet-beta'),
    utility: new Utility(
      new SafeWallet(),
      'https://api.mainnet-beta.solana.com',
    ),
  },
}

/**
 * Module exports
 */
export default conf

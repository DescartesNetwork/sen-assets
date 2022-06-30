import { Net, rpc } from '@sentre/senhub'
import { Utility } from '@sentre/utility'
import metaplexNFT from 'lib/metaplex'
import SafeWallet from 'helper/safeWallet'

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
    metaplexNFT: new metaplexNFT(rpc),
    utility: new Utility(new SafeWallet(), rpc),
  },

  /**
   * Staging configurations
   */
  testnet: {
    node: 'https://api.testnet.solana.com',
    sntrAddress: '',
    metaplexNFT: new metaplexNFT('testnet'),
    utility: new Utility(new SafeWallet(), rpc),
  },

  /**
   * Production configurations
   */
  mainnet: {
    node: 'https://api.mainnet-beta.solana.com',
    sntrAddress: 'SENBBKVCM7homnf5RX9zqpf1GFe935hnbU4uVzY1Y6M',
    metaplexNFT: new metaplexNFT(rpc),
    utility: new Utility(new SafeWallet(), rpc),
  },
}

/**
 * Module exports
 */
export default conf

import { IEtherWallet } from './walletInterface';

import { ethers } from 'ethers'
import detectEthereumProvider from '@metamask/detect-provider'

class MetamaskWallet implements IEtherWallet {
  getProvider = async () => {
    const detectedProvider: any = await detectEthereumProvider()
    if (!detectedProvider) throw new Error('No provider')
    const provider = new ethers.providers.Web3Provider(detectedProvider, 'any')
    return provider
  }

  getAddress = async () => {
    const provider = await this.getProvider()
    const addr = await provider.send('eth_requestAccounts', [])
    if (!addr[0]) throw new Error('There is no Ethereum account')
    return addr[0]
  }
}

export default MetamaskWallet

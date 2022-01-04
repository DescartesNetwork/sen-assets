import { ethers } from 'ethers'
import detectEthereumProvider from '@metamask/detect-provider'

import session from 'shared/session'
import { IEtherWallet } from './walletInterface'
import { WOH_WALLET } from '../wormhole/constant/wormhole'
import { getEtherNetwork } from '../wormhole/helper/utils'
import {
  GOERLI_ETHER_ADDRESS_PREFIX,
  MAINNET_ETHER_ADDRESS_PREFIX,
} from '../wormhole/constant/ethConfig'

class MetamaskWallet implements IEtherWallet {
  static walletType = 'MetaMask'

  getProvider = async () => {
    const detectedProvider: any = await detectEthereumProvider()
    if (!detectedProvider || !detectedProvider.isMetaMask)
      throw new Error('Cannot find MetaMask extension')
    const provider = new ethers.providers.Web3Provider(detectedProvider, 'any')

    const chainId =
      getEtherNetwork() === 'goerli'
        ? GOERLI_ETHER_ADDRESS_PREFIX
        : MAINNET_ETHER_ADDRESS_PREFIX
    await detectedProvider.request({
      method: 'wallet_switchEthereumChain',
      params: [
        {
          chainId,
        },
      ],
    })

    return provider
  }

  getAddress = async () => {
    const provider = await this.getProvider()
    const addr = await provider.send('eth_requestAccounts', [])
    if (!addr[0]) throw new Error('There is no Ethereum account')
    return addr[0]
  }

  connect = async (): Promise<void> => {
    session.set(WOH_WALLET, MetamaskWallet.walletType)
  }

  disconnect = async (): Promise<void> => {
    session.clear(WOH_WALLET)
  }
}

export default MetamaskWallet

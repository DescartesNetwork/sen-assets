import { ethers } from 'ethers'
import detectEthereumProvider from '@metamask/detect-provider'

import session from 'shared/session'
import { IEtherWallet } from './walletInterface'
import { WOH_WALLET } from '../wormhole/constant/wormhole'
import { getEtherNetwork } from '../wormhole/helper/utils'
import { CHAIN_ID_ETH } from '../wormhole/constant/ethConfig'

class Coin98Wallet implements IEtherWallet {
  static walletType = 'Coin98'

  getProvider = async () => {
    const detectedProvider: any = await detectEthereumProvider()
    if (!detectedProvider || !detectedProvider.isCoin98)
      throw new Error('Cannot find Coin98 extension')
    const provider = new ethers.providers.Web3Provider(detectedProvider, 'any')

    const expectedChainId =
      CHAIN_ID_ETH[getEtherNetwork()] || CHAIN_ID_ETH.mainnet
    const currentChainId = await detectedProvider.request({
      method: 'net_version',
    })
    if (Number(currentChainId) !== expectedChainId)
      throw new Error(
        `Incorrect Solana network of Coin98. Please change the network to ${getEtherNetwork()}.`,
      )

    return provider
  }

  getAddress = async () => {
    const provider = await this.getProvider()
    const addr = await provider.send('eth_requestAccounts', [])
    if (!addr[0]) throw new Error('There is no Ethereum account')
    return addr[0]
  }

  connect = async (): Promise<void> => {
    session.set(WOH_WALLET, Coin98Wallet.walletType)
  }

  disconnect = async (): Promise<void> => {
    session.clear(WOH_WALLET)
  }
}

export default Coin98Wallet

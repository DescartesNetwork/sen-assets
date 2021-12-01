import { ethers } from 'ethers'

export interface IEtherWallet {
  getProvider: () => Promise<ethers.providers.Web3Provider>
  getAddress: () => Promise<string>
}

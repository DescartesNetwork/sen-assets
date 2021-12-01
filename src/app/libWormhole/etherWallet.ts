import { ethers, Signer } from 'ethers'
import detectEthereumProvider from '@metamask/detect-provider'

export class EtherWallet {
  address: string = ''
  signer: Signer | undefined

  private getSigner = async () => {
    const provider = await this.getProvider()
    const addr = await provider.send('eth_requestAccounts', [])
    console.log('Your address:', addr)
    const signer = provider.getSigner() as Signer
    return signer
  }

  private getProvider = async (): Promise<ethers.providers.Web3Provider> => {
    const detectedProvider: any = await detectEthereumProvider()
    if (!detectedProvider) throw new Error('No provider')
    const provider = new ethers.providers.Web3Provider(detectedProvider, 'any')
    return provider
  }

  async connect() {
    const provider = await this.getProvider()
    const address = await provider.send('eth_requestAccounts', [])
    this.address = address[0]
    return this.address
  }

  async disconnect() {
    this.address = ''
    return this.address
  }
}

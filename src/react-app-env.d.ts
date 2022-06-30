/// <reference types="@sentre/senhub" />

interface Window {
  wormhole: {
    sourceWallet: {
      ether?: import('app/lib/etherWallet/walletInterface').IEtherWallet
      sol?: import('@senswap/sen-js').WalletInterface
    }
    targetWallet: {
      sol?: import('@senswap/sen-js').WalletInterface
      ether?: import('app/lib/etherWallet/walletInterface').IEtherWallet
    }
  }
}

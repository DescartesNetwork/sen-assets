import { Connection, PublicKey } from '@solana/web3.js'
// import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
// import { useWallet } from '@solana/wallet-adapter-react'

export const getSolConnection = () => {
  const nodeUrl = window.sentre.splt.nodeUrl
  return new Connection(nodeUrl, 'confirmed')
}

// export const useSolWallet = useWallet

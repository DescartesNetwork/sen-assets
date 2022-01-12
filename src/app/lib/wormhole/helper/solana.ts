import { Connection } from '@solana/web3.js'

export const getSolConnection = () => {
  const nodeUrl = window.sentre.splt.nodeUrl
  return new Connection(nodeUrl, 'confirmed')
}

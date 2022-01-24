import { Connection, PublicKey } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'

export const getSolConnection = () => {
  const nodeUrl = window.sentre.splt.nodeUrl
  return new Connection(nodeUrl, 'confirmed')
}

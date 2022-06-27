import { Address, AnchorProvider, web3 } from '@project-serum/anchor'
import { PublicKey } from '@solana/web3.js'

import configs from 'app/configs'

const {
  sol: { utility },
} = configs

interface WalletInterface {
  signTransaction(tx: web3.Transaction): Promise<web3.Transaction>
  signAllTransactions(txs: web3.Transaction[]): Promise<web3.Transaction[]>
}

class MultisigWallet {
  private _mint: PublicKey

  constructor(mintAddress: string) {
    this._mint = new PublicKey(mintAddress)
  }
}
export default MultisigWallet

export const getAnchorProvider = (
  node: string,
  walletAddress: Address,
  wallet: WalletInterface,
): AnchorProvider => {
  const connection = new web3.Connection(node, 'confirmed')
  const publicKey = new web3.PublicKey(walletAddress)
  return new AnchorProvider(
    connection,
    {
      publicKey: publicKey,
      signAllTransactions: wallet.signAllTransactions,
      signTransaction: wallet.signTransaction,
    },
    {
      commitment: 'confirmed',
      skipPreflight: true,
    },
  )
}

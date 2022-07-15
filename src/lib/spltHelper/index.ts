import { web3 } from '@project-serum/anchor'
import { PublicKey, Transaction } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID, Token } from '@solana/spl-token'

import { rpc } from '@sentre/senhub'
import { getAnchorProvider } from './utils'

class SpltHelper {
  private getProvider = async () => {
    const wallet = window.sentre.wallet
    const walletAddress = await wallet.getAddress()
    return getAnchorProvider(rpc, walletAddress, wallet)
  }

  closeAccounts = async (
    accounts: string[],
  ): Promise<{
    txIds: string[]
    transactions: Transaction[]
  }> => {
    if (accounts.length === 0) throw new Error('Please select accounts!')
    const provider = await this.getProvider()
    // Close account instruction
    let transactions: Transaction[] = []
    let SIZE_TRANSACTION = 25 // Limit instructions per transaction

    const instructions: web3.TransactionInstruction[] = []
    accounts.forEach((account) => {
      instructions.push(
        Token.createCloseAccountInstruction(
          TOKEN_PROGRAM_ID,
          new PublicKey(account), // to be closed token account
          provider.wallet.publicKey, // rent's destination
          provider.wallet.publicKey, // token account authority
          [], // multisig
        ),
      )
    })
    // slice small transaction
    for (let i = 0; i < instructions.length; i += SIZE_TRANSACTION) {
      transactions.push(
        new Transaction().add(...instructions.slice(i, i + SIZE_TRANSACTION)),
      )
    }
    const txIds = await provider.sendAll(
      transactions.map((tx) => {
        return { tx, signers: [] }
      }),
    )
    return { txIds, transactions }
  }
}
export default SpltHelper

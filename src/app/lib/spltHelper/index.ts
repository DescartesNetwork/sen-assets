import { web3 } from '@project-serum/anchor'
import { PublicKey, Transaction } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID, Token } from '@solana/spl-token'

import { rpc } from 'shared/runtime'
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
    txId: string
    transaction: Transaction
  }> => {
    if (accounts.length === 0) throw new Error('Please select accounts!')
    const provider = await this.getProvider()
    const instructions: web3.TransactionInstruction[] = []
    // Close account instruction
    accounts.forEach((account) => {
      instructions.push(
        Token.createCloseAccountInstruction(
          TOKEN_PROGRAM_ID, // fixed
          new PublicKey(account), // to be closed token account
          provider.wallet.publicKey, // rent's destination
          provider.wallet.publicKey, // token account authority
          [], // multisig
        ),
      )
    })
    const transaction = new Transaction().add(...instructions)
    console.log('Instruction: ', instructions)

    const txId = await provider.sendAndConfirm(transaction)
    return { txId, transaction }
  }
}
export default SpltHelper

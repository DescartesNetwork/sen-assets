import { getSignedVAA } from '@certusone/wormhole-sdk'
import { account, WalletInterface } from '@senswap/sen-js'
import { Connection, Transaction } from '@solana/web3.js'
import { asyncWait } from 'shared/util'

export const getSignedVAAWithRetry = async (
  ...args: Parameters<typeof getSignedVAA>
) => {
  let attempts = 0
  while (true) {
    try {
      await asyncWait(10000)
      console.log('Retry to get signed vaa:', ++attempts)
      const re = await getSignedVAA(...args)
      return re
    } catch (er) {
      // Nothing
    }
  }
}

export const sendTransaction = async (
  transaction: Transaction,
  connection: Connection,
): Promise<string> => {
  const tx = transaction.serialize()
  const txId = await connection.sendRawTransaction(tx, {
    skipPreflight: true,
    preflightCommitment: 'confirmed',
  })
  const {
    value: { err },
  } = await connection.confirmTransaction(txId, 'confirmed')
  if (err) throw new Error(`${err} at ${txId}`)
  return txId
}

export const getAssociatedAddress = async (
  mintAddress: string,
  wallet: WalletInterface,
) => {
  if (!account.isAddress(mintAddress)) throw new Error('Invalid mint address')
  const walletAddress = await wallet.getAddress()
  const splt = window.sentre.splt

  const targetAddress = await splt.deriveAssociatedAddress(
    walletAddress,
    mintAddress,
  )
  let initialized = false
  try {
    const { state } = await splt.getAccountData(targetAddress)
    initialized = state > 0 ? true : false
  } catch (er) {
    initialized = false
  }
  if (!initialized)
    await splt.initializeAccount(mintAddress, walletAddress, wallet)
  return targetAddress
}

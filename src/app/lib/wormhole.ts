import { Transaction, Connection } from '@solana/web3.js'
import { getSignedVAA } from '@certusone/wormhole-sdk'
import { asyncWait } from 'shared/util'

const getSignedVAAWithRetry = async (
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

const sendTransaction = async (
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

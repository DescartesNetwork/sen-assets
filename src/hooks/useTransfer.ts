import BN from 'bn.js'
import { isAddress } from '@sentre/utility'
import { useCallback } from 'react'

import { SOL_ADDRESS } from 'constant/sol'
import configs from 'configs'
import { splt } from '@sentre/senhub'

const {
  sol: { utility, lamports },
} = configs

export const useTransfer = () => {
  const transfer = useCallback(
    async (dstAddress: string, amount: BN, mint: string) => {
      if (!isAddress(dstAddress)) throw new Error('Invalid wallet address')
      const { solana } = window.sentre
      if (mint === SOL_ADDRESS) {
        return lamports.transfer(BigInt(amount.toString()), dstAddress, solana)
      }
      const { txId } = await utility.safeTransfer({
        amount: amount,
        tokenAddress: mint,
        dstWalletAddress: dstAddress,
      })
      return txId
    },
    [],
  )
  return { transfer }
}

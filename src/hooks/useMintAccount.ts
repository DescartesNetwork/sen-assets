import { useMemo } from 'react'
import { utils } from '@senswap/sen-js'
import {
  useWalletAddress,
  useWalletBalance,
  useMintDecimals,
  useAccounts,
} from '@sentre/senhub'

import { SOL_ADDRESS } from 'constant/sol'

export const useMintAccount = (accountAddr: string) => {
  const accounts = useAccounts()
  const walletAddress = useWalletAddress()
  const lamports = useWalletBalance()

  const { amount, mint } = useMemo(() => {
    // sol account
    if (accountAddr === walletAddress)
      return { amount: lamports, mint: SOL_ADDRESS }
    // spl token account
    return accounts[accountAddr] || {}
  }, [accountAddr, accounts, walletAddress, lamports])

  const decimals = useMintDecimals({ mintAddress: mint }) || 0
  const mintInfo = useMemo(() => {
    return {
      balance: utils.undecimalize(BigInt(amount || 0), decimals),
      mint,
      amount,
      decimals,
    }
  }, [amount, decimals, mint])

  return mintInfo
}

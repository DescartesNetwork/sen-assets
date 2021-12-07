import { useMemo } from 'react'
import { utils } from '@senswap/sen-js'

import { useAccount, useWallet } from 'senhub/providers'
import useMintDecimals from 'app/shared/hooks/useMintDecimals'
import useMintCgk from 'app/shared/hooks/useMintCgk'
import { numeric } from 'shared/util'
import { SOL_ADDRESS } from 'app/constant/sol'

const Balance = ({
  accountAddr,
  inUSD = false,
  autoHidden = false,
  format = '0,0.[00]',
}: {
  accountAddr: string
  inUSD?: boolean
  autoHidden?: boolean
  format?: string
}) => {
  const { accounts } = useAccount()
  const { wallet } = useWallet()

  const { amount, mint } = useMemo(() => {
    // sol account
    if (accountAddr === wallet.address)
      return { amount: wallet.lamports, mint: SOL_ADDRESS }
    // spl token account
    return accounts[accountAddr]
  }, [accountAddr, accounts, wallet.address, wallet.lamports])

  const decimals = useMintDecimals(mint)
  const cgkData = useMintCgk(mint)

  const balanceDisplay = useMemo(() => {
    let balance = Number(utils.undecimalize(amount, decimals))
    if (inUSD) balance = Number(balance) * cgkData.price
    const prefix = inUSD ? '$' : ''
    return prefix + numeric(balance).format(format)
  }, [amount, cgkData.price, decimals, format, inUSD])

  if (autoHidden && !cgkData.price) return <span>--</span>
  return <span>{balanceDisplay}</span>
}

export default Balance

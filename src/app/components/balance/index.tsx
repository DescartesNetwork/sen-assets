import { useMemo } from 'react'
import { utils } from '@senswap/sen-js'

import { numeric } from 'shared/util'
import useMintCgk from 'app/hooks/useMintCgk'
import { useMintAccount } from 'app/hooks/useMintAccount'

const Balance = ({
  accountAddr,
  inUSD = false,
  autoHidden = false,
  format = '0,0.[00]',
  maxLength = 6,
  sortFormat = '0,0.[00]a',
}: {
  accountAddr: string
  inUSD?: boolean
  autoHidden?: boolean
  format?: string
  maxLength?: number
  sortFormat?: string
}) => {
  const { amount, mint, decimals } = useMintAccount(accountAddr)
  const cgkData = useMintCgk(mint)

  const balanceDisplay = useMemo(() => {
    let balance = Number(utils.undecimalize(amount, decimals))
    if (inUSD) balance = Number(balance) * cgkData.price
    const prefix = inUSD ? '$' : ''
    let balanceUI = numeric(balance).format(format)
    if (balanceUI.replace(/\D/g, '').length > maxLength)
      balanceUI = numeric(balance).format(sortFormat)
    return prefix + balanceUI
  }, [amount, cgkData.price, decimals, format, inUSD, maxLength, sortFormat])

  if (autoHidden && !cgkData.price) return <span>--</span>
  return <span>{balanceDisplay}</span>
}

export default Balance

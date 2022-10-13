import { useMemo } from 'react'
import { utils } from '@senswap/sen-js'

import { util } from '@sentre/senhub'
import useMintCgk from 'hooks/useMintCgk'
import { useMintAccount } from 'hooks/useMintAccount'

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
    let balance = Number(utils.undecimalize(BigInt(amount), decimals))
    if (inUSD) balance = Number(balance) * cgkData.price
    const prefix = inUSD ? '$' : ''
    let balanceUI = util.numeric(balance).format(format)
    if (balanceUI.replace(/\D/g, '').length > maxLength)
      balanceUI = util.numeric(balance).format(sortFormat)
    return prefix + balanceUI
  }, [amount, cgkData.price, decimals, format, inUSD, maxLength, sortFormat])

  if (autoHidden && !cgkData.price) return <span>--</span>
  return <span>{balanceDisplay}</span>
}

export default Balance

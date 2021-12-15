import { useMemo } from 'react'
import { utils } from '@senswap/sen-js'

import { numeric } from 'shared/util'
import useMintCgk from 'app/shared/hooks/useMintCgk'
import { useMintAccount } from 'app/shared/hooks/useMintAccount'

const Balance = ({
  accountAddr,
  inUSD = false,
  autoHidden = false,
  format = '0,0.[00]',
  maxLength,
  sortFomart = '0,0.[00]a'
}: {
  accountAddr: string
  inUSD?: boolean
  autoHidden?: boolean
  format?: string
  maxLength?: number,
  sortFomart?: string
}) => {
  const { amount, mint, decimals } = useMintAccount(accountAddr)
  const cgkData = useMintCgk(mint)

  const balanceDisplay = useMemo(() => {
    let balance = Number(utils.undecimalize(amount, decimals))
    let wrapFormat = format
    if (maxLength && String(balance).length > maxLength) sortFomart
    
    if (inUSD) balance = Number(balance) * cgkData.price
    const prefix = inUSD ? '$' : ''
    return prefix + numeric(balance).format(wrapFormat)
  }, [amount, cgkData.price, decimals, format, inUSD, maxLength, sortFomart])

  if (autoHidden && !cgkData.price) return <span>--</span>
  return <span>{balanceDisplay}</span>
}

export default Balance

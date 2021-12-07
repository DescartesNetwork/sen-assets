import { useMemo } from 'react'
import { utils } from '@senswap/sen-js'

import { numeric } from 'shared/util'
import useMintCgk from 'app/shared/hooks/useMintCgk'
import { useMintAccount } from 'app/shared/hooks/useBalance'

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
  const { amount, mint, decimals } = useMintAccount(accountAddr)
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

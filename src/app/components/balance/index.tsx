import { useMemo } from 'react'
import { utils } from '@senswap/sen-js'

import { useAccount } from 'senhub/providers'
import useMintDecimals from 'app/shared/hooks/useMintDecimals'
import useMintCgk from 'app/shared/hooks/useMintCgk'
import { numeric } from 'shared/util'

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
  const { amount, mint } = accounts[accountAddr]
  const decimals = useMintDecimals(mint)
  const cgkData = useMintCgk(mint)

  const balanceDisplay = useMemo(() => {
    let balance = Number(utils.undecimalize(amount, decimals))
    if (inUSD) balance = Number(balance) * cgkData.price
    const prefix = inUSD ? '$' : ''
    return prefix + numeric(balance).format(format)
  }, [amount, cgkData.price, decimals, format, inUSD])

  if (autoHidden && !cgkData.price) return null
  return <span>{balanceDisplay}</span>
}

export default Balance

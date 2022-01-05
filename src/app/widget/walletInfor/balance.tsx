import { useCallback, useEffect, useState } from 'react'
import { utils } from '@senswap/sen-js'

import { Skeleton, Typography } from 'antd'

import { numeric, fetchCGK } from 'shared/util'
import { useAccount, useMint, useWallet } from 'senhub/providers'

const Balance = ({ hidden = false }: { hidden?: boolean }) => {
  const { accounts } = useAccount()
  const { tokenProvider } = useMint()
  const {
    wallet: { lamports },
  } = useWallet()
  const [usd, setUsd] = useState(0)

  const getTotalBalance = useCallback(async () => {
    let usd = 0

    // Calculate SOL
    const cgkData = await fetchCGK('solana')
    const balance = numeric(utils.undecimalize(lamports, 9))
    usd += Number(balance) * (cgkData?.price || 0)

    // Calculate mints
    for (const accountAddress of Object.keys(accounts)) {
      try {
        const { mint: mintAddress, amount } = accounts[accountAddress] || {}
        const tokenInfor = await tokenProvider.findByAddress(mintAddress)
        if (!tokenInfor) continue
        const { extensions, decimals } = tokenInfor
        const ticket = extensions?.coingeckoId
        if (!ticket) continue
        const cgkData = await fetchCGK(ticket)
        const { price } = cgkData
        const accountBalance =
          Number(utils.undecimalize(amount, decimals)) * price
        usd += accountBalance
      } catch (er) {
        console.log(er)
      }
    }
    return setUsd(usd)
  }, [lamports, accounts, tokenProvider])

  useEffect(() => {
    getTotalBalance()
  }, [getTotalBalance])

  return hidden ? (
    <Skeleton.Input
      style={{ width: 128, borderRadius: 4 }}
      size="small"
      active
    />
  ) : (
    <Typography.Text style={{ fontWeight: 700 }}>{`$${numeric(usd).format(
      '0,0.[00]',
    )}`}</Typography.Text>
  )
}

export default Balance

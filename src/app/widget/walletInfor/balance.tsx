import { useCallback, useEffect, useState, useMemo } from 'react'

import { Skeleton, Typography } from 'antd'

import { fetchCGK } from 'shared/helper'
import { numeric } from 'shared/util'
import { useWallet } from 'senhub/providers'
import { utils } from '@senswap/sen-js'

const Balance = ({ hidden = false }: { hidden?: boolean }) => {
  const [cgkData, setCGKData] = useState<CgkData>()

  const {
    wallet: { lamports },
  } = useWallet()

  const balance = numeric(utils.undecimalize(lamports, 9)).format('0.[000]')
  const usd = useMemo(() => {
    return numeric(Number(balance) * (cgkData?.price || 0)).format('0,0.[000]')
  }, [balance, cgkData])

  const getCGKData = useCallback(async () => {
    const cgkData = await fetchCGK('solana')
    return setCGKData(cgkData)
  }, [])
  useEffect(() => {
    getCGKData()
  }, [getCGKData])

  return hidden ? (
    <Skeleton.Input
      style={{ width: 128, borderRadius: 4 }}
      size="small"
      active
    />
  ) : (
    <Typography.Text style={{ fontWeight: 700 }}>{`$${usd}`}</Typography.Text>
  )
}

export default Balance

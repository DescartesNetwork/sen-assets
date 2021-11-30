import { useCallback, useEffect, useMemo, useState } from 'react'

import { Avatar, Space, Typography } from 'antd'

import { fetchCGK } from 'shared/helper'
import { useWallet } from 'senhub/providers'

const Solana = () => {
  const [solanaData, setSolanaData] = useState<CgkData>()
  const { name, icon } = solanaData || {}
  const {
    wallet: { address },
  } = useWallet()

  const fetchSolanaData = useCallback(async () => {
    const solanaData = await fetchCGK('solana')
    return setSolanaData(solanaData)
  }, [])

  useEffect(() => {
    fetchSolanaData()
  }, [fetchSolanaData])

  const shortenMintAddress = useMemo(() => address?.substring(0, 6), [address])
  const isConnect = false

  return (
    <Space>
      <Avatar
        src={icon}
        size={32}
        style={{ backgroundColor: '#2D3355', border: 'none' }}
      />
      <Space direction="vertical" size={0}>
        <Typography.Text style={{ fontWeight: 600 }}>{name}</Typography.Text>
        {isConnect && (
          <Typography.Text style={{ fontSize: 12 }}>
            {shortenMintAddress}
          </Typography.Text>
        )}
      </Space>
    </Space>
  )
}

export default Solana

import { useCallback, useEffect, useMemo, useState } from 'react'

import { Avatar, Space, Typography } from 'antd'

import { fetchCGK } from 'shared/helper'

const Ethereum = () => {
  const [ethereumData, setEthereumData] = useState<CgkData>()
  const { address, name, icon } = ethereumData || {}

  const fetchSolanaData = useCallback(async () => {
    const ethereumData = await fetchCGK('ethereum')
    return setEthereumData(ethereumData)
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

export default Ethereum

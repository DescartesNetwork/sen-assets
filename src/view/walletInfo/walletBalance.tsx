import { useCallback, useEffect, useState } from 'react'
import { util } from '@sentre/senhub'

import IonIcon from '@sentre/antd-ionicon'
import { Button, Skeleton, Space, Typography } from 'antd'

import useTotalUSD from 'hooks/useTotalBalanceUDS'

const VisibleBalance = () => {
  return (
    <Space>
      <Typography.Title level={3}>*****</Typography.Title>
      <Typography.Text type="secondary">*****</Typography.Text>
    </Space>
  )
}

const WalletTotalUSD = () => {
  const [solPrice, setSolPrice] = useState(0)
  const { loading, totalUSD } = useTotalUSD()

  const getSolanaPrice = useCallback(async () => {
    try {
      const { price } = await util.fetchCGK('solana')
      setSolPrice(price)
    } catch (err) {
      setSolPrice(0)
    }
  }, [])

  useEffect(() => {
    getSolanaPrice()
  }, [getSolanaPrice])

  if (loading) return <Skeleton.Button active size="small" block />

  return (
    <Space>
      <Typography.Title level={3}>
        {util.numeric(totalUSD).format('0,0.[00]$')}
      </Typography.Title>
      <Typography.Text type="secondary">
        ~
        {util.numeric(!!totalUSD ? totalUSD / solPrice : 0).format('0,0.[000]')}{' '}
        SOL
      </Typography.Text>
      <IonIcon name="alert-outline" />
    </Space>
  )
}

const WalletBalance = () => {
  const [visible, setVisible] = useState(false)

  return (
    <Space direction="vertical">
      <Space>
        <Typography.Text>Total token assets value</Typography.Text>
        <Button
          type="text"
          shape="circle"
          icon={<IonIcon name="eye-outline" />}
          onClick={() => setVisible(!visible)}
        />
      </Space>
      {visible ? <WalletTotalUSD /> : <VisibleBalance />}
    </Space>
  )
}

export default WalletBalance

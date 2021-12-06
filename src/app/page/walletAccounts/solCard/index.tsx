import { useState, useEffect } from 'react'
import { DEFAULT_EMPTY_ADDRESS, utils } from '@senswap/sen-js'

import {
  Row,
  Col,
  Card,
  Avatar,
  Tooltip,
  Divider,
  Space,
  Typography,
} from 'antd'
import { useWallet } from 'senhub/providers'

import IonIcon from 'shared/ionicon'
import { fetchCGK } from 'shared/helper'
import { numeric } from 'shared/util'
import { PriceChange } from 'app/components/price'



const Sol = ({ onClick = () => { }, active = false }: { onClick?: (address: string) => void, active?: boolean }) => {
  const [cgkData, setCGKData] = useState<CgkData>()

  const { wallet: { lamports } } = useWallet()
  const balance = utils.undecimalize(lamports, 9)

  useEffect(() => {
    ; (async () => {
      const cgkData = await (fetchCGK('solana'))
      setCGKData(cgkData)
    })()
  }, [])

  return (
    <Card
      style={{
        border: `1px solid ${active ? '#F9575E' : 'transparent'}`,
        borderRadius: 8
      }}
      bodyStyle={{ padding: '8px 12px', cursor: 'pointer' }}
      onClick={() => onClick(DEFAULT_EMPTY_ADDRESS)}
      bordered={false}
      hoverable
    >
      <Row gutter={[12, 8]} align="middle" wrap={false}>
        <Col flex="auto">
          <Space style={{ whiteSpace: 'nowrap' }}>
            <Avatar src={cgkData?.icon} size={22}>
              <IonIcon name="diamond-outline" />
            </Avatar>
            <Tooltip title={`${balance} SOL`}>
              <Typography.Text>
                {numeric(balance).format('0,0.[00]')}{' '}
              </Typography.Text>
              <Typography.Text type="secondary">SOL</Typography.Text>
            </Tooltip>
            <Divider type="vertical" style={{ margin: 0 }} />
            <Typography.Text>
              ${numeric(cgkData?.price).format('0,0.[000]')}
            </Typography.Text>
          </Space>
        </Col>
        <Col>
          <PriceChange mintAddress={DEFAULT_EMPTY_ADDRESS} colorized />
        </Col>
      </Row>
    </Card>
  )
}

export default Sol

import { Button, Col, Input, Row, Typography } from 'antd'
import QRcode from 'qrcode.react'
import React from 'react'
import { useWallet } from 'senhub/providers'

const Receive = () => {
  const { wallet } = useWallet()
  return (
    <Row justify="center" gutter={[16,16]} >
      <Col>
        <QRcode
          value={wallet.address}
          size={84}
          bgColor="#ffffff"
          fgColor="#1f1f1f"
        />
      </Col>
      <Col span={24}>
        <Row gutter={[8, 8]}>
          <Col span={24}>
            <Typography.Text>SOL receive address</Typography.Text>
          </Col>
          <Col span={24}>
            <Input
              size="large"
              value={'dev.sentre.io/lklnafs8s98ád98ád90a09d0ád-0'}
            />
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <Button type="primary" block>
          Receive
        </Button>
      </Col>
    </Row>
  )
}

export default Receive

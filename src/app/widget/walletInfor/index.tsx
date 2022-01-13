import { useState } from 'react'
import { utils } from '@senswap/sen-js'
import { useWallet } from '@senhub/providers'

import { Avatar, Button, Col, Row, Space, Typography } from 'antd'
import Address from './address'
import Balance from './balance'
import IonIcon from 'shared/antd/ionicon'

import { shortenAddress } from 'shared/util'

const WalletInfor = () => {
  const {
    wallet: { address },
  } = useWallet()
  const [hidden, setHidden] = useState(false)

  return (
    <Row gutter={[16, 16]} wrap={false} align="middle">
      <Col>
        <Avatar size={48}>
          <span style={{ fontSize: 24 }}>{utils.randEmoji(address)}</span>
        </Avatar>
      </Col>
      <Col flex="auto">
        <Row>
          <Col span={24}>
            <Row gutter={[2, 2]} align="middle">
              <Col flex="auto">
                <Typography.Text>
                  {shortenAddress(address, 3, '...')}
                </Typography.Text>
              </Col>
              <Col>
                <Address />
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <Space>
              <Balance hidden={hidden} />
              <Button
                type="text"
                size="small"
                icon={
                  <IonIcon name={hidden ? 'eye-off-outline' : 'eye-outline'} />
                }
                onClick={() => setHidden(!hidden)}
              />
            </Space>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default WalletInfor

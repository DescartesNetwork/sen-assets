import { useState } from 'react'

import { Avatar, Button, Col, Row, Space, Typography } from 'antd'
import Address from './address'
import Balance from './balance'
import IonIcon from 'shared/antd/ionicon'

import { shortenAddress } from 'shared/util'
import { useWallet } from 'senhub/providers'
import { utils } from '@senswap/sen-js'

const WalletInfor = () => {
  const {
    wallet: { address },
  } = useWallet()
  const [hidden, setHidden] = useState(false)

  return (
    <Row gutter={[16, 16]}>
      <Col flex="auto">
        <Row gutter={[16, 16]}>
          <Col>
            <Avatar size={48}>
              <span style={{ fontSize: 24 }}>{utils.randEmoji(address)}</span>
            </Avatar>
          </Col>
          <Col>
            <Space direction="vertical" size={4}>
              <Typography.Text>
                {shortenAddress(address, 3, '...')}
              </Typography.Text>
              <Space>
                <Balance hidden={hidden} />
                <Button
                  type="text"
                  icon={
                    <IonIcon
                      name={hidden ? 'eye-off-outline' : 'eye-outline'}
                    />
                  }
                  onClick={() => setHidden(!hidden)}
                />
              </Space>
            </Space>
          </Col>
        </Row>
      </Col>
      <Col>
        <Address />
      </Col>
    </Row>
  )
}

export default WalletInfor

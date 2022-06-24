import { useState } from 'react'
import { useAccount, useUI } from '@senhub/providers'

import { Button, Card, Col, Divider, Modal, Row, Space } from 'antd'
import AccountAction from 'app/view/accountAction'
import LogoItem from './logoItem'
import ValueItem from './value'
import AmountItem from './amount'
import PriceItem from './price'
import DayChangeItem from './dayChangeItem'

import { SOL_ADDRESS } from 'app/constant/sol'

const AccountCard = ({
  accountAddr,
  onClick = () => {},
  isSol = false,
}: {
  accountAddr: string
  active?: boolean
  onClick?: (address: string) => void
  isSol?: boolean
}) => {
  const [visible, setVisible] = useState(false)
  const { accounts } = useAccount()
  const mint = accounts[accountAddr]?.mint
  const {
    ui: { width },
  } = useUI()
  const isMobile = width < 768

  return (
    <Card
      className="account-item"
      bodyStyle={{ padding: 12 }}
      hoverable
      onClick={() => onClick(accountAddr)}
    >
      <Row>
        <Col md={{ span: 5, order: 1 }} xs={{ span: 12, order: 1 }}>
          {/* Token Info */}
          <LogoItem mint={!isSol ? mint : SOL_ADDRESS} />
        </Col>
        {!isMobile && (
          <Col md={{ span: 1, order: 1 }}>
            <Divider style={{ height: '100%' }} type="vertical" />
          </Col>
        )}
        <Col xs={{ span: 24, order: 3 }} md={{ span: 12, order: 2 }}>
          <Row gutter={[8, 8]}>
            {/* Balance */}
            <Col xs={12} md={6}>
              <AmountItem accountAddr={accountAddr} />
            </Col>
            {/* Value */}
            <Col xs={12} md={6}>
              <ValueItem accountAddr={accountAddr} />
            </Col>
            {/* Price */}
            <Col xs={12} md={6}>
              <PriceItem mint={!isSol ? mint : SOL_ADDRESS} />
            </Col>
            {/* 24h Change */}
            <Col xs={12} md={6}>
              <DayChangeItem mint={!isSol ? mint : SOL_ADDRESS} />
            </Col>
          </Row>
        </Col>
        {/* Manage */}
        <Col
          md={{ span: 6, order: 3 }}
          xs={{ span: 12, order: 2 }}
          style={{ textAlign: 'right' }}
        >
          <Space style={{ height: '100%' }} align="center">
            <Button
              ghost
              style={{ border: 'none' }}
              onClick={() => setVisible(true)}
            >
              Manage
            </Button>
          </Space>
        </Col>
      </Row>
      <Modal
        visible={visible}
        footer={false}
        onCancel={() => setVisible(false)}
        maskClosable={true}
        centered
        className="modal-sen-assets"
        bodyStyle={{
          borderRadius: '16px',
        }}
      >
        <AccountAction />
      </Modal>
    </Card>
  )
}

export default AccountCard

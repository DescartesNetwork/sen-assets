import { useState } from 'react'
import { useAccounts, useWidth } from '@sentre/senhub'

import { Button, Card, Col, Divider, Modal, Row, Space } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import AccountAction from 'view/accountAction'
import LogoItem from './logoItem'
import ValueItem from './value'
import AmountItem from './amount'
import PriceItem from './price'
import DayUpdateChangeItem from './dayUpdateChangeItem'

import { SOL_ADDRESS } from 'constant/sol'

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
  const accounts = useAccounts()
  const mint = accounts[accountAddr]?.mint
  const width = useWidth()
  const isMobile = width < 768

  return (
    <Card
      className="account-item"
      bodyStyle={{ padding: 16 }}
      onClick={() => onClick(accountAddr)}
    >
      <Row>
        <Col md={{ span: 6, order: 1 }} xs={{ span: 18, order: 1 }}>
          {/* Token Info */}
          <LogoItem mint={!isSol ? mint : SOL_ADDRESS} />
        </Col>
        {!isMobile && (
          <Col md={{ span: 1, order: 1 }}>
            <Divider style={{ height: '100%' }} type="vertical" />
          </Col>
        )}
        <Col xs={{ span: 24, order: 3 }} md={{ span: 14, order: 2 }}>
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
              <DayUpdateChangeItem mint={!isSol ? mint : SOL_ADDRESS} />
            </Col>
          </Row>
        </Col>
        {/* Manage */}
        <Col
          md={{ span: 3, order: 3 }}
          xs={{ span: 6, order: 2 }}
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
        open={visible}
        footer={false}
        onCancel={() => setVisible(false)}
        maskClosable={true}
        centered
        className="modal-sen-assets"
        bodyStyle={{
          borderRadius: '16px',
        }}
        closeIcon={<IonIcon name="close-outline" />}
      >
        <AccountAction />
      </Modal>
    </Card>
  )
}

export default AccountCard

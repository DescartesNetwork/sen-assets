import { Card, Col, Row, Space, Typography } from 'antd'
import { MintAvatar, MintName, MintSymbol } from 'app/components/mint'
import Price, { PriceChange, PriceIndicator } from 'app/components/price'

import { useAccount } from 'senhub/providers'
import Balance from 'app/components/balance'

const AccountCard = ({
  accountAddr,
  active = false,
  onClick = () => {},
}: {
  accountAddr: string
  active?: boolean
  onClick?: (address: string) => void
}) => {
  const { accounts } = useAccount()
  const mint = accounts[accountAddr]?.mint

  return (
    <Card
      className={`account-item ${active ? 'active' : ''}`}
      bodyStyle={{ padding: 12 }}
      hoverable
      onClick={() => onClick(accountAddr)}
    >
      <Row>
        <Col span={13}>
          {/* Token Info */}
          <Space>
            <MintAvatar mintAddress={mint} size={32} />
            <Space direction="vertical" size={0}>
              <Typography.Text>
                <MintSymbol mintAddress={mint} />
              </Typography.Text>
              <Typography.Text type="secondary" className="caption">
                <MintName mintAddress={mint} />
              </Typography.Text>
            </Space>
          </Space>
        </Col>
        {/* Balance */}
        <Col span={5} style={{ height: '100%' }}>
          <Space
            direction="vertical"
            size={0}
            align="end"
            style={{ width: '100%' }}
          >
            <Typography.Text>
              <Balance accountAddr={accountAddr} />
            </Typography.Text>
            <Typography.Text type="secondary" className="caption">
              <Balance accountAddr={accountAddr} inUSD autoHidden />
            </Typography.Text>
          </Space>
        </Col>
        {/* Token Price */}
        <Col span={6}>
          <Space
            direction="vertical"
            size={0}
            align="end"
            style={{ width: '100%' }}
          >
            <Typography.Text>
              <Space size={2}>
                <PriceIndicator mintAddress={mint} colorized />
                <PriceChange mintAddress={mint} colorized />
              </Space>
            </Typography.Text>
            <Typography.Text type="secondary" className="caption">
              <Price mintAddress={mint} />
            </Typography.Text>
          </Space>
        </Col>
      </Row>
    </Card>
  )
}

export default AccountCard

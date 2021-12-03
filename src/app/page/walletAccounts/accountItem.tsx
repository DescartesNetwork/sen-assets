import { Card, Col, Row, Space, Typography } from 'antd'
import { MintAvatar, MintName, MintSymbol } from 'app/shared/components/mint'
import Price, { PriceChange, PriceIndicator } from 'app/components/price'

import useTokenProvider from 'app/shared/hooks/useTokenProvider'
import { useAccount } from 'senhub/providers'
import Balance from 'app/components/balance'

const AccountItem = ({
  accountAddr,
  active = false,
  onClick = () => {},
}: {
  accountAddr: string
  active?: boolean
  onClick?: (address: string) => void
}) => {
  const {
    accounts: {
      [accountAddr]: { mint },
    },
  } = useAccount()

  const tokens = useTokenProvider(mint)
  let ticket = null
  if (tokens?.length === 1) ticket = tokens[0]?.extensions?.coingeckoId

  return (
    <Card
      className="account-item"
      bodyStyle={{ padding: 12 }}
      style={{
        border: `1px solid ${active ? '#F9575E' : 'transparent'}`,
        borderRadius: 8,
      }}
      bordered={false}
      hoverable
      onClick={() => onClick(accountAddr)}
    >
      <Row>
        <Col span={12}>
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
        <Col flex="auto" style={{ height: '100%' }}>
          <Space direction="vertical" size={0} align="start">
            <Typography.Text>
              <Balance accountAddr={accountAddr} />
            </Typography.Text>
            <Typography.Text type="secondary" className="caption">
              <Balance accountAddr={accountAddr} inUSD autoHidden />
            </Typography.Text>
          </Space>
        </Col>
        {/* Token Price */}
        <Col>
          <Space direction="vertical" size={0} align="end">
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

export default AccountItem

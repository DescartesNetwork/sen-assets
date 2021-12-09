import { Card, Col, Row, Space, Typography } from 'antd'
import { MintAvatar, MintName, MintSymbol } from 'app/shared/components/mint'
import Balance from 'app/components/balance'
import IonIcon from 'shared/antd/ionicon'

import { useAccount } from 'senhub/providers'

const AccountItem = ({
  accountAddr,
  onClick = () => {},
}: {
  accountAddr: string
  onClick?: (address: string) => void
}) => {
  const {
    accounts: {
      [accountAddr]: { mint },
    },
  } = useAccount()

  return (
    <Card
      className="account-item"
      style={{ borderRadius: 8 }}
      bodyStyle={{ padding: 12 }}
      bordered={false}
      hoverable
      onClick={() => onClick(accountAddr)}
    >
      <Row>
        <Col flex="auto">
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
        <Col style={{ height: '100%' }}>
          <Space>
            <Space direction="vertical" size={0} align="end">
              <Typography.Text>
                <Balance accountAddr={accountAddr} />
              </Typography.Text>
              <Typography.Text type="secondary" className="caption">
                <Balance accountAddr={accountAddr} inUSD autoHidden />
              </Typography.Text>
            </Space>
            <IonIcon
              style={{ color: '#7A7B85' }}
              name="arrow-forward-outline"
            />
          </Space>
        </Col>
      </Row>
    </Card>
  )
}

export default AccountItem

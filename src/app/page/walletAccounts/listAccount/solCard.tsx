import { Row, Col, Card, Tooltip, Divider, Space, Typography } from 'antd'
import Price, { PriceChange, PriceIndicator } from 'app/components/price'
import Balance from 'app/components/balance'
import { MintAvatar } from 'app/shared/components/mint'

import { utils } from '@senswap/sen-js'
import { useWallet } from 'senhub/providers'
import { SOL_ADDRESS } from 'app/constant/sol'

const SolCard = ({
  onClick = () => {},
  active = false,
  price = true,
}: {
  onClick?: (address: string) => void
  active?: boolean
  price?: boolean
}) => {
  const {
    wallet: { address: walletAddr, lamports },
  } = useWallet()
  const balance = utils.undecimalize(lamports, 9)

  return (
    <Card
      className={`account-item ${active ? 'active' : ''}`}
      bodyStyle={{ padding: '8px 12px', cursor: 'pointer' }}
      onClick={() => onClick(walletAddr)}
      hoverable
    >
      <Row gutter={[12, 8]} align="middle" wrap={false}>
        <Col flex="auto">
          <Space style={{ whiteSpace: 'nowrap' }}>
            <MintAvatar mintAddress={SOL_ADDRESS} size={22} />
            {/* balance */}
            <Tooltip title={`${balance} SOL`}>
              <Typography.Text>
                <Balance accountAddr={walletAddr} />{' '}
              </Typography.Text>
              <Typography.Text type="secondary">SOL</Typography.Text>
            </Tooltip>
            <Divider type="vertical" style={{ margin: 0 }} />
            <Typography.Text>
              <Balance accountAddr={walletAddr} inUSD />
            </Typography.Text>
          </Space>
        </Col>
        {price && (
          <Col>
            <PriceIndicator mintAddress={SOL_ADDRESS} colorized />
            <Space>
              <PriceChange mintAddress={SOL_ADDRESS} colorized />
              <Typography.Text type="secondary">
                <Price mintAddress={SOL_ADDRESS} />
              </Typography.Text>
            </Space>
          </Col>
        )}
      </Row>
    </Card>
  )
}

export default SolCard

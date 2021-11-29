import { Card, Col, Row, Space, Typography } from 'antd'
import MintAvatar from 'app/shared/components/mintAvatar'
import MintName from 'app/shared/components/mintName'
import MintSymbol from 'app/shared/components/mintSymbol'
import Price, { PriceChange, PriceIndicator } from 'app/components/price'

import useMintCgk from 'app/shared/hooks/useMintCgk'
import useMintDecimals from 'app/shared/hooks/useMintDecimals'
import useTokenProvider from 'app/shared/hooks/useTokenProvider'
import { useAccount } from 'senhub/providers'
import { numeric } from 'shared/util'
import { utils } from '@senswap/sen-js'

const AccountItem = ({
  address,
  active = false,
  onClick = () => {},
}: {
  address: string
  active?: boolean
  onClick?: (address: string) => void
}) => {
  const {
    accounts: {
      [address]: { mint, amount },
    },
  } = useAccount()

  const decimals = useMintDecimals(mint)
  const cgkData = useMintCgk(mint)
  const tokens = useTokenProvider(mint)

  let ticket = null
  if (tokens?.length === 1) ticket = tokens[0]?.extensions?.coingeckoId
  const balance = utils.undecimalize(amount, decimals)

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
      onClick={() => onClick(address)}
    >
      <Row align="middle">
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
        <Col flex="auto">
          <Space direction="vertical" size={0}>
            <Typography.Text>
              {numeric(balance).format('0,0.[00]')}
            </Typography.Text>
            {cgkData.price && (
              <Typography.Text type="secondary" className="caption">
                <MintName mintAddress={mint} />
              </Typography.Text>
            )}
          </Space>
        </Col>
        {/* Token Price */}
        {ticket && (
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
        )}
      </Row>
    </Card>
  )
}

export default AccountItem

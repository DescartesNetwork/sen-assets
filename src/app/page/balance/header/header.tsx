import { Col, Row, Space, Typography, Divider } from 'antd'
import MintAvatar from 'app/components/mint/mintAvatar'
import MintSymbol from 'app/components/mint/mintSymbol'
import Address from './address/address'
import Price, { PriceChange } from 'os/components/price'
import { useAccount } from 'senhub/providers'
import useMintCgk from 'app/hooks/useMintCgk'
import { utils } from '@senswap/sen-js'
import { numeric } from 'shared/util'
import { useSelector } from 'react-redux'
import { AppState } from 'app/model'
import useMintDecimals from 'app/hooks/useMintDecimals'
import useTokenProvider from 'app/hooks/useTokenProvider'

const Header = () => {
  const { accountSelected } = useSelector((state: AppState) => state.account)
  const { accounts } = useAccount()
  const account = accounts[accountSelected] || {}
  const mint = account.mint

  const token = useTokenProvider(mint)
  const decimals = useMintDecimals(mint)
  const balance = utils.undecimalize(account.amount, decimals)
  const cgkData = useMintCgk(mint)

  const total = cgkData.price * Number(balance)
  const ticket = token?.extensions?.coingeckoId

  return (
    <Row className="header-balance" gutter={[16, 16]}>
      {/* You balance + Address */}
      <Col span={24}>
        <Row>
          <Col flex="auto">
            <Typography.Text className="secondary">
              Your balance
            </Typography.Text>
          </Col>
          <Col>
            <Address />
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <Row gutter={[8, 8]}>
          <Col flex="auto">
            {/* Sol icon + symbol */}
            <Space direction="vertical">
              <Space>
                <MintAvatar mintAddress={mint} />
                <Typography.Title className="title" level={5}>
                  <MintSymbol mintAddress={mint} />
                </Typography.Title>
              </Space>
              {/* Balance */}
              <Space align="center">
                <Typography.Title className="title" level={3}>
                  {numeric(balance).format('0,0.[000]')}
                </Typography.Title>
                <Typography.Text className="secondary">
                  ~{numeric(total).format('0,0.[000]')}
                </Typography.Text>
              </Space>
            </Space>
          </Col>
          <Col>
            {/* Sol Price */}
            {ticket && (
              <Space size={1} align="end">
                <Typography.Text className="text">
                  <PriceChange ticket={ticket} colorized />
                </Typography.Text>
                <Divider
                  className="secondary"
                  type="vertical"
                  style={{ padding: 0 }}
                />

                <Typography.Text className="text">
                  <Price ticket={ticket} />
                </Typography.Text>
              </Space>
            )}
          </Col>
        </Row>
      </Col>
    </Row>
  )
}
export default Header

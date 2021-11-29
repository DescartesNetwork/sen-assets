import { useSelector } from 'react-redux'

import { Col, Row, Space, Typography, Divider } from 'antd'
import MintAvatar from 'app/shared/components/mintAvatar'
import MintSymbol from 'app/shared/components/mintSymbol'
import WalletAddress from './walletAddress/walletAddress'

import { utils } from '@senswap/sen-js'
import { useAccount } from 'senhub/providers'
import { numeric } from 'shared/util'
import { AppState } from 'app/model'
import useMintCgk from 'app/shared/hooks/useMintCgk'
import useMintDecimals from 'app/shared/hooks/useMintDecimals'
import useTokenProvider from 'app/shared/hooks/useTokenProvider'

import Price, { PriceChange } from 'os/components/price'

const Header = () => {
  const { accountSelected } = useSelector((state: AppState) => state.account)
  const { accounts } = useAccount()
  const account = accounts[accountSelected] || {}
  const mint = account.mint

  const tokens = useTokenProvider(mint)
  const decimals = useMintDecimals(mint)
  const balance = utils.undecimalize(account.amount, decimals)
  const cgkData = useMintCgk(mint)

  const total = cgkData.price * Number(balance)
  let ticket = null
  if (tokens?.length === 1) ticket = tokens[0]?.extensions?.coingeckoId

  return (
    <Row className="header-balance" gutter={[16, 16]}>
      {/* You balance + Address */}
      <Col span={24}>
        <Row>
          <Col flex="auto">
            <Typography.Text className="text-secondary">
              Your balance
            </Typography.Text>
          </Col>
          <Col>
            <WalletAddress />
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <Row gutter={[8, 8]}>
          <Col flex="auto">
            {/* Mint icon + symbol */}
            <Space direction="vertical">
              <Space>
                <MintAvatar mintAddress={mint} />
                <Typography.Title className="title-color" level={5}>
                  <MintSymbol mintAddress={mint} />
                </Typography.Title>
              </Space>
              {/* Balance */}
              <Space align="center">
                <Typography.Title className="title-color" level={3}>
                  {numeric(balance).format('0,0.[000]')}
                </Typography.Title>
                <Typography.Text className="text-secondary">
                  ~{numeric(total).format('0,0.[000]')}
                </Typography.Text>
              </Space>
            </Space>
          </Col>
          <Col>
            {/* Mint Price */}
            {ticket && (
              <Space size={1} align="end">
                <Typography.Text className="text-color">
                  <PriceChange ticket={ticket} colorized />
                </Typography.Text>
                <Divider
                  className="text-secondary"
                  type="vertical"
                  style={{ padding: 0 }}
                />

                <Typography.Text className="text-color">
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

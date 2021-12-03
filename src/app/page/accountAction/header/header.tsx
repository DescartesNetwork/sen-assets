import { useSelector } from 'react-redux'

import { Col, Row, Space, Typography } from 'antd'
import WalletAddress from './walletAddress/walletAddress'
import { TokenPrice } from './tokenPrice'

import { utils } from '@senswap/sen-js'
import { useAccount } from 'senhub/providers'
import { numeric } from 'shared/util'
import { AppState } from 'app/model'
import useMintCgk from 'app/shared/hooks/useMintCgk'
import useMintDecimals from 'app/shared/hooks/useMintDecimals'

const Header = () => {
  const { accountSelected } = useSelector((state: AppState) => state.account)
  const { accounts } = useAccount()
  const account = accounts[accountSelected] || {}
  const mint = account.mint

  const decimals = useMintDecimals(mint)
  const balance = utils.undecimalize(account.amount, decimals)
  const cgkData = useMintCgk(mint)

  const total = cgkData.price * Number(balance)

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
          <Col span={24}>
            <TokenPrice mintAddress={mint} />
          </Col>
          <Col span={24}>
            {/* Balance */}
            <Space direction="vertical">
              <Space align="baseline">
                <Typography.Title className="title-color" level={3}>
                  {numeric(balance).format('0,0.[000]')}
                </Typography.Title>
                <Typography.Text className="text-secondary">
                  ~ ${numeric(total).format('0,0.[000]')}
                </Typography.Text>
              </Space>
            </Space>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}
export default Header

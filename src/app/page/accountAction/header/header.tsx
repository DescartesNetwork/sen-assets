import { useSelector } from 'react-redux'

import { Col, Row, Space, Typography } from 'antd'
import WalletAddress from './walletAddress/walletAddress'
import Balance from 'app/components/balance'
import { TokenPrice } from './tokenPrice'

import { AppState } from 'app/model'
import { useMintAccount } from 'app/hooks/useMintAccount'

const Header = () => {
  const { accountSelected } = useSelector((state: AppState) => state.account)
  const { mint } = useMintAccount(accountSelected)

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
            <Space align="baseline">
              <Typography.Title className="title-color" level={3}>
                <Balance accountAddr={accountSelected} />
              </Typography.Title>
              <Typography.Text className="text-secondary">
                ~<Balance accountAddr={accountSelected} inUSD />
              </Typography.Text>
            </Space>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}
export default Header

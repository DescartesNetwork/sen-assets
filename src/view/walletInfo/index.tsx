import { Card, Col, Row } from 'antd'
import WalletBalance from './walletBalance'

const WalletInfo = () => {
  return (
    <Card bordered={false}>
      <Row gutter={[24, 24]}>
        <Col>
          <WalletBalance />
        </Col>
      </Row>
    </Card>
  )
}

export default WalletInfo

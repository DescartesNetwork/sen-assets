import { Row, Col, Card } from 'antd'
import ListAccount from './listAccount'
import WalletInfor from './walletInfor'

const Widget = () => {
  return (
    <Card
      style={{ height: '100%', overflow: 'auto' }}
      className="card-sen-assets scrollbar"
      bordered={false}
    >
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <WalletInfor />
        </Col>
        <Col span={24}>
          <ListAccount />
        </Col>
      </Row>
    </Card>
  )
}

export default Widget

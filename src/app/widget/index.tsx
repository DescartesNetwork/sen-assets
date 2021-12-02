import { Row, Col, Card } from 'antd'
import ListAccount from './listAccount'
import WalletInfor from './walletInfor'

import '../static/styles/index.less'

const Widget = () => {
  return (
    <Card className="card-sen-assets" bordered={false}>
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

import { Card, Col, Row } from 'antd'
import ListAccount from 'app/components/account/listAccount'
import Header from './header'

const SenAssets = () => {
  return (
    <Card className="card-page">
      <Row gutter={[24, 24]}>
        {/* Header */}
        <Col span={24}>
          <Header />
        </Col>
        {/* Body + Search */}
        <Col span={24}>
          <Row gutter={[12, 12]}>
            <ListAccount />
          </Row>
        </Col>
      </Row>
    </Card>
  )
}
export default SenAssets

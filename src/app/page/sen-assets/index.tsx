import { Card, Col, Row, Typography } from 'antd'
import ListAccount from 'app/components/account/listAccount'
import Settings from 'app/components/settings/settings'

const SenAssets = () => {
  return (
    <Card className="card-page">
      <Row gutter={[24, 24]}>
        {/* Header */}
        <Col flex="auto">
          <Typography.Title level={4}>Sen Assets</Typography.Title>
        </Col>
        <Col>
          <Settings />
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

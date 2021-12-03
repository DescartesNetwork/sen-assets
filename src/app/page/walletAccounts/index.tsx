import { Card, Col, Row, Typography } from 'antd'
import ListAccount from 'app/page/walletAccounts/listAccount'
import Settings from 'app/page/walletAccounts/settings/settings'

const SenAssets = () => {
  return (
    <Card className="card-page card-sen-assets" bordered={false}>
      <Row gutter={[24, 24]} align="middle">
        {/* Header */}
        <Col flex="auto">
          <Typography.Title level={4}>Sen Assets</Typography.Title>
        </Col>
        <Col>
          <Settings />
        </Col>
        {/* Body + Search */}
        <Col span={24}>
          <ListAccount />
        </Col>
      </Row>
    </Card>
  )
}
export default SenAssets

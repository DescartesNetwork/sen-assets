import { Row, Col, Card, Typography } from 'antd'

import Settings from './settings'
import ListAccount from 'app/view/tokens/listAccount'

const Tokens = () => {
  return (
    <Row gutter={[24, 24]} justify="center" align="middle">
      <Card className="card-page card-sen-assets scrollbar">
        {/* Header */}
        <Row gutter={[24, 24]}>
          <Col flex="auto">
            <Typography.Title level={4}>Tokens Asset</Typography.Title>
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
    </Row>
  )
}

export default Tokens

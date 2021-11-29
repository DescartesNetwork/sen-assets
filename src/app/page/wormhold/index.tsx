import { Card, Col, Row, Typography } from 'antd'

const WormHold = () => {
  return (
    <Card className="card-page">
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Typography.Title level={4}>
            Wormhole <span style={{ color: '#F9575E' }}>Bridge</span>
          </Typography.Title>
        </Col>
      </Row>
    </Card>
  )
}

export default WormHold

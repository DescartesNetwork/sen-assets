import { Col, Row, Typography } from 'antd'
import PoweredBy from 'os/components/poweredBy'

const WormTitle = () => {
  return (
    <Row gutter={[24, 24]}>
      <Col flex="auto">
        <Typography.Title level={4}>
          Wormhole <span style={{ color: '#F9575E' }}>Bridge</span>
        </Typography.Title>
      </Col>
      <Col>
        <PoweredBy />
      </Col>
    </Row>
  )
}

export default WormTitle
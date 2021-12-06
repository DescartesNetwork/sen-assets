import { Col, Row, Typography } from 'antd'
import PowerBy from 'os/components/powerBy'

const WormTitle = () => {
  return (
    <Row gutter={[24, 24]}>
      <Col flex="auto">
        <Typography.Title level={4}>
          Wormhole <span style={{ color: '#F9575E' }}>Bridge</span>
        </Typography.Title>
      </Col>
      <Col>
        <PowerBy />
      </Col>
    </Row>
  )
}

export default WormTitle

import { Col, Row, Space, Typography } from 'antd'

const WormTitle = () => {
  return (
    <Row gutter={[24, 24]}>
      <Col span={24} style={{ textAlign: 'center' }}>
        <Space direction="vertical">
          <Typography.Title level={4} style={{ color: '#f09a2c' }}>
            Portal Bridge
          </Typography.Title>
          <Typography.Text type="secondary">
            Select a token to send through the Wormhole Bridge.
          </Typography.Text>
        </Space>
      </Col>
    </Row>
  )
}

export default WormTitle

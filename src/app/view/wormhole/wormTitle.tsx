import { Col, Row, Space, Typography } from 'antd'

const WormTitle = () => {
  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Space align="baseline">
          <Typography.Title level={4} style={{ color: '#f09a2c' }}>
            Portal Bridge
          </Typography.Title>
          <Typography.Text type="secondary">by Wormhole</Typography.Text>
        </Space>
      </Col>
    </Row>
  )
}

export default WormTitle

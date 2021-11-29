import { Card, Col, Row, Typography } from 'antd'

const History = () => {
  return (
    <Card style={{ height: '33vw', overflow: 'auto' }}>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Typography.Title level={4}>History</Typography.Title>
        </Col>
      </Row>
    </Card>
  )
}
export default History

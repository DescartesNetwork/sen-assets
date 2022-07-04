import { Col, Row, Typography } from 'antd'
import Bridge from './wormhole'

import './index.less'

const History = () => {
  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Typography.Title level={4}>History</Typography.Title>
      </Col>
      <Col span={24}>
        <Bridge />
      </Col>
    </Row>
  )
}

export default History

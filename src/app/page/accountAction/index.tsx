import { Card, Col, Row } from 'antd'
import Header from './header/header'
import Body from './body'

const Balance = () => {
  return (
    <Card className="card-page" bordered={false} bodyStyle={{ padding: 0 }}>
      <Row>
        <Col span={24}>
          <Header />
        </Col>
        <Col span={24}>
          <Body />
        </Col>
      </Row>
    </Card>
  )
}

export default Balance

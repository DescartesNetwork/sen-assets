import IonIcon from '@sentre/antd-ionicon'
import { Card, Row, Col, Space, Typography } from 'antd'

const CardDescription = () => {
  return (
    <Card className="card-cleanup" bordered={false} style={{ height: '200px' }}>
      <Row gutter={[0, 24]}>
        <Col span={24}>
          <Space>
            <IonIcon name="layers" style={{ fontSize: 24 }} />
            <Typography.Title level={4}>Description</Typography.Title>
          </Space>
        </Col>
        <Col span={24}>
          <Typography.Text>
            Okay Bears is a culture shift. A clean collection of 10,000 diverse
            bears building a virtuous community that will transcend the internet
            into the real world.
          </Typography.Text>
        </Col>
      </Row>
    </Card>
  )
}

export default CardDescription

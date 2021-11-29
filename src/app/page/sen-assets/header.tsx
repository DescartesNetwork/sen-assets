import { Col, Row, Typography } from 'antd'
import Settings from 'app/components/settings'


const Header = () => {
  return (
    <Row align="middle">
      <Col flex="auto">
        <Typography.Title level={4}>Sen Assets</Typography.Title>
      </Col>
      <Col>
        <Settings />
      </Col>
    </Row>
  )
}
export default Header

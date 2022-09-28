import { Col, Row, Tabs } from 'antd'
import { MENU_LIST } from 'helper/menuList'

const Dashboard = () => {
  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Tabs items={MENU_LIST} />
      </Col>
    </Row>
  )
}

export default Dashboard

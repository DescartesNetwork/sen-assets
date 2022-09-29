import { Col, Row, Tabs } from 'antd'
import { MENU_LIST } from 'helper/menuList'

import './index.less'

const Dashboard = () => {
  return (
    <Row>
      <Col span={24}>
        <Tabs items={MENU_LIST} className="assets-dashboard scrollbar" />
      </Col>
    </Row>
  )
}

export default Dashboard

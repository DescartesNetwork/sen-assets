import { useWidth, Infix } from '@sentre/senhub'

import { Col, Row, Tabs } from 'antd'
import { MENU_LIST } from 'helper/menuList'

import './index.less'

const Dashboard = () => {
  const width = useWidth()
  const isMobile = width < Infix.md
  const tabCln = isMobile
    ? 'assets-dashboard scrollbar text-visible'
    : 'assets-dashboard scrollbar'

  return (
    <Row>
      <Col span={24}>
        <Tabs items={MENU_LIST} className={tabCln} />
      </Col>
    </Row>
  )
}

export default Dashboard

import { Card, Col, Row, Tabs } from 'antd'
import Bridge from './bridge'
import Transaction from './tracsaction'

import './index.less'

const History = () => {
  return (
    <Card bodyStyle={{ paddingTop: 12 }}>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Tabs>
            <Tabs.TabPane tab="Bridge history" key="Bridge">
              <Bridge />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Transaction history" key="Transaction">
              <Transaction />
            </Tabs.TabPane>
          </Tabs>
        </Col>
      </Row>
    </Card>
  )
}

export default History

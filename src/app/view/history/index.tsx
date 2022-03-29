import { Card, Col, Row, Tabs } from 'antd'
import Bridge from './wormhole'
import Transaction from './transaction'

import './index.less'

const History = () => {
  return (
    <Card bodyStyle={{ paddingTop: 12 }} bordered={false}>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Tabs>
            <Tabs.TabPane tab="Transaction History" key="Transaction">
              <Transaction />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Wormhole Bridge History" key="Wormhole">
              <Bridge />
            </Tabs.TabPane>
          </Tabs>
        </Col>
      </Row>
    </Card>
  )
}

export default History

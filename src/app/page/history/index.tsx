import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { Card, Col, Row, Tabs } from 'antd'
import Bridge from './wormhole'
import Transaction from './transaction'

import { fetchWormholeHistory } from 'app/model/history.controller'
import './index.less'

const History = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchWormholeHistory())
  }, [dispatch])

  return (
    <Card bodyStyle={{ paddingTop: 12 }}>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Tabs>
            <Tabs.TabPane tab="Wormhole Bridge history" key="Wormhole">
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

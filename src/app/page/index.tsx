import { Row, Col } from 'antd'

import SenAssets from './walletAccounts'
import Balance from './accountAction'
import WormHold from './wormHold'
import History from './history'

import 'app/static/styles/index.less'

const Page = () => {
  return (
    <Row gutter={[24, 24]} align="middle">
      <Col span={24}>
        <Row gutter={[24, 24]} style={{ height: 454 }}>
          <Col xl={8} sm={12} xs={24}>
            <SenAssets />
          </Col>
          <Col xl={8} sm={12} xs={24}>
            <Balance />
          </Col>
          <Col xl={8} sm={12} xs={24}>
            <WormHold />
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <History />
      </Col>
    </Row>
  )
}

export default Page

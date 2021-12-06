import { Row, Col } from 'antd'

import SenAssets from './walletAccounts'
import Balance from './accountAction'
import WormHole from './wormhole'
import History from './history'

import 'app/static/styles/index.less'

const Page = () => {
  return (
    <Row gutter={[24, 24]} align="middle">
      <Col xl={8} md={12} sm={24}>
        <SenAssets />
      </Col>
      <Col xl={8} md={12} sm={24}>
        <Balance />
      </Col>
      <Col xl={8} md={12} sm={24}>
        <WormHole />
      </Col>
      <Col xl={24} sm={12} xs={24}>
        <History />
      </Col>
    </Row>
  )
}

export default Page

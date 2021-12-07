import { Row, Col } from 'antd'

import SenAssets from './walletAccounts'
import Balance from './accountAction'
import WormHole from './wormhole'
import History from './history'

import 'app/static/styles/index.less'

const Page = () => {
  return (
    <Row gutter={[24, 24]}>
      <Col xl={8} md={12} sm={24}>
        <SenAssets />
      </Col>
      <Col xl={8} md={12} sm={24}>
        <Balance />
      </Col>
      <Col xl={8} md={12} sm={24}>
        <WormHole />
      </Col>
      <Col span={24}>
        <History />
      </Col>
      <Col span={24} />
    </Row>
  )
}

export default Page

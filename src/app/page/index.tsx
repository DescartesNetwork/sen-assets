import { Row, Col } from 'antd'

import SenAssets from './walletAccounts'
import AccountAction from './accountAction'
import WormHole from './wormhole'
import History from './history'

const Page = () => {
  return (
    <Row gutter={[24, 24]}>
      <Col xl={8} md={12} sm={24}>
        <SenAssets />
      </Col>
      <Col xl={8} md={12} sm={24}>
        <AccountAction />
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

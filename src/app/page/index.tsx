import { Row, Col } from 'antd'

import SenAssets from './sen-assets'
import Balance from './balance'
import WormHold from './wormhold'
import History from './history'

import './styles/index.less'

const Page = () => {
  return (
    <Row gutter={[24, 24]} align="middle">
      <Col xl={8} sm={12} xs={24}>
        <SenAssets />
      </Col>
      <Col xl={8} sm={12} xs={24}>
        <Balance />
      </Col>
      <Col xl={8} sm={12} xs={24}>
        <WormHold />
      </Col>
      <Col span={24}>
        <History />
      </Col>
    </Row>
  )
}

export default Page

import { Row, Col } from 'antd'

import SenAssets from './sen-assets'
import Balance from './balance'
import WormHold from './wormhold'
import History from './history'
import WidgetContainer from 'os/components/widgetLoader/widgetContainer'

const Page = () => {
  return (
    <Row gutter={[24, 24]} align="middle">
      <WidgetContainer size="small">
        <SenAssets />
      </WidgetContainer>
      <Col span={8}>
        <Balance />
      </Col>
      <Col span={8}>
        <WormHold />
      </Col>
      <Col span={24}>
        <History />
      </Col>
    </Row>
  )
}

export default Page

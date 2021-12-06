import { Card, Col, Row } from 'antd'
import WormAction from './wormAction'
import WormTitle from './wormTitle'
import WormWallet from './wormWallet'
import SelectMintInput from 'app/page/wormhole/mintTransfer'

const WormHole = () => {
  return (
    <Card className="card-page" bordered={false}>
      <Row gutter={[14, 14]}>
        <Col span={24}>
          <WormTitle />
        </Col>
        <Col span={24}>
          <WormWallet />
        </Col>
        <Col span={24}>
          <SelectMintInput />
        </Col>
        <Col span={24}>
          <WormAction />
        </Col>
      </Row>
    </Card>
  )
}

export default WormHole

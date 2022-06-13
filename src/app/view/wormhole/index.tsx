import { Card, Col, Row } from 'antd'
import WormAction from './actionNext'
import WormTitle from './wormTitle'
import WormWallet from './walletConnect'
import SelectMintInput from 'app/view/wormhole/sourceInput'

const WormHole = () => {
  return (
    <Row gutter={[24, 24]} justify="center" align="middle">
      <Col xs={24} md={16} lg={16} xl={12} xxl={12}>
        <Card className="card-page" style={{ height: 442 }}>
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
      </Col>
    </Row>
  )
}

export default WormHole

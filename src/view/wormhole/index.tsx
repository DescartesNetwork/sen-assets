import { Card, Col, Row, Space, Typography } from 'antd'
import WormAction from './actionNext'
import WormWallet from './walletConnect'
import SelectMintInput from 'view/wormhole/sourceInput'
import History from '../history'

export const WormHoleFrame = () => {
  return (
    <Card className="card-page-container" style={{ height: 442 }}>
      <Row gutter={[14, 14]}>
        <Col span={24}>
          <Typography.Title level={2}>Portal Bridge</Typography.Title>
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

const WormHole = () => {
  return (
    <Row justify="center" align="middle">
      <Col xs={24} md={16} lg={16} xl={16} xxl={12}>
        <Space direction="vertical" size={24} style={{ width: '100%' }}>
          <Typography.Title level={2}>Portal Bridge</Typography.Title>
          <Card
            className="card-page-container"
            bodyStyle={{ padding: 0, overflow: 'hidden' }}
            bordered={false}
          >
            <WormWallet />
            <Row gutter={[14, 14]} style={{ padding: 24 }}>
              <Col span={24}>
                <SelectMintInput />
              </Col>
              <Col span={24}>
                <WormAction />
              </Col>
            </Row>
          </Card>
          <Card className="card-page-container" bordered={false}>
            <History />
          </Card>
        </Space>
      </Col>
    </Row>
  )
}

export default WormHole

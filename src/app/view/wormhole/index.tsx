import { Card, Col, Row, Space, Typography } from 'antd'
import WormAction from './actionNext'
import WormTitle from './wormTitle'
import WormWallet from './walletConnect'
import SelectMintInput from 'app/view/wormhole/sourceInput'
import History from '../history'

const WormHole = () => {
  return (
    <Row justify="center" align="middle">
      <Col xs={24} md={16} lg={16} xl={16} xxl={12}>
        <Space direction="vertical" size={24} style={{ width: '100%' }}>
          <Typography.Title level={2}>Portal Bridge</Typography.Title>
          <Card className="card-page-container">
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
          <Card className="card-page-container">
            <History />
          </Card>
        </Space>
      </Col>
    </Row>
  )
}

export default WormHole

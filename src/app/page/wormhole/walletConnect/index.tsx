import { Card, Col, Row, Tooltip } from 'antd'
import WalletTitle from './walletTitle'

import IonIcon from 'shared/ionicon'
import SourceWallet from './networkConnect/sourceWallet'
import TargetWallet from './networkConnect/targetWallet'

const WormWallet = () => {
  return (
    <Card
      bordered={false}
      className="account-item"
      bodyStyle={{ padding: 16 }}
    >
      <Row gutter={[16, 16]} justify="center">
        <Col span={24}>
          <WalletTitle title="Source Network" label="Source" />
          <SourceWallet />
        </Col>
        <Col>
          <Tooltip title="Coming soon" style={{ background: 'red' }}>
            <IonIcon
              name="git-compare-outline"
              style={{ cursor: 'not-allowed' }}
            />
          </Tooltip>
        </Col>
        <Col span={24}>
          <WalletTitle title="Target network" label="Target" />
          <TargetWallet />
        </Col>
      </Row>
    </Card>
  )
}

export default WormWallet

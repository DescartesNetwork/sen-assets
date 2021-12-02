import { Card, Col, Row } from 'antd'
import WalletTitle from './walletTitle'

import IonIcon from 'shared/ionicon'
import SourceWallet from './networkConnect/sourceWallet'
import TargetWallet from './networkConnect/targetWallet'

const WormWallet = () => {
  return (
    <Card bordered={false}>
      <Row gutter={[12, 12]} justify="center">
        <Col span={24}>
          <WalletTitle title="title" label="Source" />
          <SourceWallet />
        </Col>
        <Col>
          <IonIcon
            name="git-compare-outline"
            style={{ cursor: 'not-allowed' }}
          />
        </Col>
        <Col span={24}>
          <WalletTitle title="title 2" label="Target" />
          <TargetWallet />
        </Col>
      </Row>
    </Card>
  )
}

export default WormWallet

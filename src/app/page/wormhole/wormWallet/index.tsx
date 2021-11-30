import { Card, Col, Row } from 'antd'
import { useState } from 'react'
import IonIcon from 'shared/ionicon'
import WalletConnections from './walletConnections'
import WalletTitle from './walletTitle'

const WormWallet = () => {
  const [soucreWallet, setSoucreWallet] = useState('Select')

  return (
    <Card bordered={false} hoverable={false}>
      <Row gutter={[12, 12]} justify="center">
        <Col span={24}>
          <WalletTitle title="title" label="Source" />
          <WalletConnections solWallet />
        </Col>
        <Col>
          <IonIcon name="git-compare-outline" />
        </Col>
        <Col span={24}>
          <WalletTitle title="title 2" label="Target" />
          <WalletConnections value={soucreWallet} onChange={setSoucreWallet} />
        </Col>
      </Row>
    </Card>
  )
}

export default WormWallet

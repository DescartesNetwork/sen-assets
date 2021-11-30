import { useState } from 'react'

import { Card, Col, Row } from 'antd'
import WalletConnections from './walletConnections'
import WalletTitle from './walletTitle'

import IonIcon from 'shared/ionicon'

const WormWallet = () => {
  const [soucreWallet, setSoucreWallet] = useState('Select')

  return (
    <Card bordered={false}>
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

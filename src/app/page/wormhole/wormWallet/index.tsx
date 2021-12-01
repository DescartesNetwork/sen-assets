import { useState } from 'react'

import { Card, Col, Row } from 'antd'
import WalletTitle from './walletTitle'

import IonIcon from 'shared/ionicon'
import SourceWallet from './networkWallet/sourceWallet'
import TargetWallet from './networkWallet/targetWallet'

const WormWallet = () => {
  const [soucreWallet, setSoucreWallet] = useState('Select')
  const [targetWallet, setTargetWallet] = useState('solana')

  const onSwapWallet = () => {
    const cloneTargetWallet = deepClone(targetWallet)
    const cloneSourceWallet = deepClone(soucreWallet)

    setSoucreWallet(cloneTargetWallet)
    setTargetWallet(cloneSourceWallet)
  }

  const deepClone = (value: string) => {
    if (!value) return
    return JSON.parse(JSON.stringify(value))
  }

  return (
    <Card bordered={false}>
      <Row gutter={[12, 12]} justify="center">
        <Col span={24}>
          <WalletTitle title="title" label="Source" />
          <SourceWallet />
        </Col>
        <Col>
          <IonIcon
            onClick={onSwapWallet}
            name="git-compare-outline"
            style={{ cursor: 'pointer' }}
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

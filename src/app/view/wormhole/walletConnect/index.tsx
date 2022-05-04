import { Card, Col, Row, Tooltip } from 'antd'
import WalletTitle from './walletTitle'

import IonIcon from 'shared/antd/ionicon'
import SourceWallet from './networkConnect/sourceWallet'
import TargetWallet from './networkConnect/targetWallet'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from 'app/model'
import { changeSourceAndTargetChain } from 'app/model/wormhole.controller'
import { asyncWait } from 'shared/util'
import { useState } from 'react'

const WormWallet = () => {
  const {
    wormhole: { sourceChain, targetChain },
  } = useSelector((state: AppState) => state)
  const dispatch = useDispatch<AppDispatch>()
  const [isLoading, setIsLoading] = useState(false)

  const onSwitch = async () => {
    // Await all dispatchs finished
    if (!isLoading) {
      setIsLoading(true)
      await dispatch(
        changeSourceAndTargetChain({
          sourceChain: targetChain,
          targetChain: sourceChain,
        }),
      )
      await asyncWait(1000)
      setIsLoading(false)
    }
  }

  return (
    <Card bordered={false} className="account-item" bodyStyle={{ padding: 16 }}>
      <Row gutter={[16, 16]} justify="center">
        <Col span={24}>
          <WalletTitle title="Source Network" label="Source" />
          <SourceWallet />
        </Col>
        <Col>
          <Tooltip title="Switch" style={{ background: 'red' }}>
            <IonIcon
              name="git-compare-outline"
              style={{ cursor: 'pointer' }}
              onClick={onSwitch}
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
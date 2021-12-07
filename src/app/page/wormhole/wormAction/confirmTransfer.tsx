import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Button, Checkbox, Col, Row, Space, Typography } from 'antd'

import { AppDispatch, AppState } from 'app/model'
import { updateWormholeHistory } from 'app/model/history.controller'
import { Progress } from 'app/components/progress'
import { setProcess } from 'app/model/wormhole.controller'
import { TransferState } from 'app/lib/wormhole/constant/wormhole'
import { WohEthSol } from 'app/lib/wormhole'
import { explorer } from 'shared/util'
import IonIcon from 'shared/ionicon'

const ConfirmAction = ({
  onClose = () => {},
}: {
  onClose?: (visible: boolean) => void
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { sourceTokens, tokenAddress, amount } = useSelector(
    (state: AppState) => state.wormhole,
  )
  const [acceptable, setAcceptable] = useState(false)
  const [loading, setLoading] = useState(false)

  const onUpdate = async (stateTransfer: TransferState) => {
    await dispatch(setProcess({ id: stateTransfer.context.id }))
    await dispatch(updateWormholeHistory({ stateTransfer }))
  }

  const onTransfer = async () => {
    await setLoading(true)
    try {
      //Transfer
      const { sourceWallet, targetWallet } = window.wormhole
      const tokenTransfer = sourceTokens[tokenAddress]
      if (!sourceWallet.ether || !targetWallet.sol || !tokenTransfer)
        throw new Error('Login fist')

      let wormholeTransfer = new WohEthSol(
        sourceWallet.ether,
        targetWallet.sol,
        tokenTransfer,
      )

      const txId = await wormholeTransfer.transfer(amount, onUpdate)
      window.notify({
        type: 'success',
        description: 'Transfer successfully',
        onClick: () => window.open(explorer(txId), '_blank'),
      })
      return onClose(false)
    } catch (error) {
      window.notify({ type: 'error', description: (error as any).message })
    } finally {
      setLoading(false)
      await dispatch(setProcess({ id: '' }))
    }
  }

  return (
    <Row gutter={[8, 8]} justify="center">
      <Col span={24} style={{ textAlign: 'justify' }}>
        <Space align="start">
          <Typography.Text style={{ color: '#D72311' }}>
            <IonIcon name="alert-circle-outline" />
          </Typography.Text>
          <Typography.Text style={{ color: '#D72311', fontSize: 12 }}>
            You should wait until the process is complete or you can minimize
            this dialog. However, the process will fail if you exit the Sen
            Assets.
          </Typography.Text>
        </Space>
      </Col>
      <Col span={24}>
        {loading ? (
          <Progress />
        ) : (
          <Checkbox
            checked={acceptable}
            onChange={() => setAcceptable(!acceptable)}
            disabled={loading}
          >
            I have read and understood
          </Checkbox>
        )}
      </Col>
      <Col span={24}>
        <Button
          onClick={onTransfer}
          type="primary"
          block
          disabled={!acceptable}
          loading={loading}
        >
          Approve {amount} token
        </Button>
      </Col>
      <Col>
        <Button type="text" onClick={() => onClose(false)}>
          {loading ? 'Minimize' : 'Cancel'}
        </Button>
      </Col>
    </Row>
  )
}

export default ConfirmAction

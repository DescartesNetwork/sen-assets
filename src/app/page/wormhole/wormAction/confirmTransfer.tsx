import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Button, Checkbox, Col, Row } from 'antd'

import { AppState } from 'app/model'
import { WormholeProvider } from 'app/lib/wormhole/provider'
import { fetchWormholeHistory } from 'app/model/history.controller'
import { Progress } from 'app/components/progress'
import { setProcess, transfer } from 'app/model/wormhole.controller'

const ConfirmAction = ({
  onClose = () => {},
}: {
  onClose?: (visible: boolean) => void
}) => {
  const dispatch = useDispatch()
  const wormholeState = useSelector((state: AppState) => state.wormhole)
  const [acceptable, setAcceptable] = useState(false)
  const [loading, setLoading] = useState(false)

  const onUpdate = async (wormhole: WormholeProvider) => {
    await dispatch(setProcess({ provider: wormhole }))
    await dispatch(fetchWormholeHistory())
    window.notify({
      type: 'warning',
      description: 'Pending transfer from Ethereum',
    })
  }

  const onTransfer = async () => {
    setLoading(true)
    try {
      dispatch(transfer({ onUpdate }))
    } catch (error) {
      window.notify({
        type: 'error',
        description: (error as any).message,
      })
    } finally {
      setLoading(false)
    }
  }

  // confirm button
  return (
    <Row gutter={[8, 8]} justify="center">
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
          Approve {wormholeState.amount} token
        </Button>
      </Col>
      <Col>
        <Button type="text" onClick={() => onClose(false)}>
          {loading ? 'Loading' : 'Cancel'}
        </Button>
      </Col>
    </Row>
  )
}

export default ConfirmAction

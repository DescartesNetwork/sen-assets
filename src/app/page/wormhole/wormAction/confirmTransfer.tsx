import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Button, Checkbox, Col, Progress, Row } from 'antd'

import { AppState } from 'app/model'
import { WormholeProvider } from 'app/lib/wormhole/provider'
import { fetchWormholeHistory } from 'app/model/history.controller'

const TIME_INTERVAL = 50
const PERCENTAGE = 100
const PERCENT_PER_SECOND = 1

const ConfirmAction = ({
  onClose = () => {},
}: {
  onClose?: (visible: boolean) => void
}) => {
  const dispatch = useDispatch()
  const wormholeState = useSelector((state: AppState) => state.wormhole)
  const [acceptable, setAcceptable] = useState(false)
  const [percent, setPercent] = useState(0)
  const [loading, setLoading] = useState(false)

  const onReloadDataWormhole = () => {
    dispatch(fetchWormholeHistory())
    console.log('Update here')
    setLoading(true)
    window.notify({
      type: 'warning',
      description: 'Pending transfer from Ethereum',
    })
  }
  const onTransfer = async () => {
    const { sourceTokens, tokenAddress, amount } = wormholeState
    const tokenTransfer = sourceTokens[tokenAddress]
    // get wallet provider
    const { sourceWallet, targetWallet } = window.wormhole
    if (!sourceWallet.ether || !targetWallet.sol || !tokenTransfer)
      throw new Error('Login fist')
    const wormholeEther = new WormholeProvider(
      sourceWallet.ether,
      targetWallet.sol,
      tokenTransfer,
      onReloadDataWormhole,
    )
    wormholeEther.transfer(amount)
  }

  const closeModal = useCallback(() => {
    setLoading(false)
    setAcceptable(false)
    setPercent(0)
    onClose(false)
  }, [onClose])

  // set loading percentage
  useEffect(() => {
    if (!loading) return
    let count = percent
    const interval = setInterval(() => {
      count += PERCENT_PER_SECOND
      setPercent(count)
    }, TIME_INTERVAL)
    if (percent >= PERCENTAGE) closeModal()
    return () => clearInterval(interval)
  }, [closeModal, loading, percent])

  // confirm button
  return (
    <Row gutter={[8, 8]} justify="center">
      <Col span={24}>
        {loading ? (
          <Progress percent={percent} showInfo={false} />
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
        <Button type="text" onClick={closeModal}>
          {loading ? 'Loading' : 'Cancel'}
        </Button>
      </Col>
    </Row>
  )
}

export default ConfirmAction

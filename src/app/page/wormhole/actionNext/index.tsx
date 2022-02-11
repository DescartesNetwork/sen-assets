import { useDispatch, useSelector } from 'react-redux'

import { Button, Col, Row } from 'antd'
import ConfirmBridge from './confirm'

import { AppDispatch, AppState } from 'app/model'
import { setVisibleProcess } from 'app/model/wormhole.controller'

const WormAction = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    wormhole: { amount, processId, visible, waiting, targetWalletAddress },
  } = useSelector((state: AppState) => state)

  const loading = waiting || !!processId

  const setVisible = (visible: boolean) =>
    dispatch(setVisibleProcess({ visible }))

  return (
    <Row>
      <Col span={24}>
        {loading ? (
          <Button
            disabled={visible}
            type="primary"
            onClick={() => setVisible(true)}
            block
          >
            Reopen
          </Button>
        ) : (
          <Button
            disabled={!Number(amount) || !targetWalletAddress}
            type="primary"
            onClick={() => setVisible(true)}
            block
          >
            Next
          </Button>
        )}
      </Col>

      <ConfirmBridge visible={visible} onCancel={setVisible} />
    </Row>
  )
}
export default WormAction

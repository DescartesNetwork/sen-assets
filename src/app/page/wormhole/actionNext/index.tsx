import { useDispatch, useSelector } from 'react-redux'

import { Button, Col, Row, Tooltip } from 'antd'
import ConfirmBridge from './confirm'

import { AppState } from 'app/model'
import { setVisibleProcess } from 'app/model/wormhole.controller'

const WormAction = () => {
  const dispatch = useDispatch()
  const { amount, processId, visible } = useSelector(
    (state: AppState) => state.wormhole,
  )

  const setVisible = (visible: boolean) =>
    dispatch(setVisibleProcess({ visible }))

  return (
    <Row>
      <Col span={24}>
        <Tooltip title={!processId ? '' : 'Have transaction in progress'}>
          <Button
            disabled={!Number(amount) || !!processId}
            type="primary"
            onClick={() => setVisible(true)}
            block
          >
            Next
          </Button>
        </Tooltip>
      </Col>

      <ConfirmBridge visible={visible} onCancel={setVisible} />
    </Row>
  )
}
export default WormAction

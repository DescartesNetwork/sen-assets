import { useDispatch, useSelector } from 'react-redux'

import { Button, Col, Row, Tooltip } from 'antd'
import ConfirmBridge from './confirm'

import { AppDispatch, AppState } from 'app/model'
import { setVisibleProcess } from 'app/model/wormhole.controller'

const WormAction = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    wormhole: { amount, processId, visible, waiting },
  } = useSelector((state: AppState) => state)

  const loading = waiting || !!processId

  const setVisible = (visible: boolean) =>
    dispatch(setVisibleProcess({ visible }))

  return (
    <Row>
      <Col span={24}>
        {loading ? (
          <Tooltip title={'Have transaction in progress'}>
            <Button
              disabled={visible}
              type="primary"
              onClick={() => setVisible(true)}
              block
            >
              Reopen
            </Button>
          </Tooltip>
        ) : (
          <Button
            disabled={!Number(amount)}
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

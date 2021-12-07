import { useState } from 'react'

import { Button, Col, Row, Tooltip } from 'antd'
import ConfirmBridge from './networkTransfer'
import { useSelector } from 'react-redux'
import { AppState } from 'app/model'

const WormAction = () => {
  const { amount, processId } = useSelector((state: AppState) => state.wormhole)
  const [visible, setVisible] = useState(false)

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

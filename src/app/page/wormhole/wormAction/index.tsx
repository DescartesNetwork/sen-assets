import { useState } from 'react'

import { Button, Col, Row } from 'antd'
import ConfirmBridge from './networkTransfer'
import { useSelector } from 'react-redux'
import { AppState } from 'app/model'

const WormAction = () => {
  const { amount } = useSelector((state: AppState) => state.wormhole)
  const [visible, setVisible] = useState(false)

  return (
    <Row>
      <Col span={24}>
        <Button
          disabled={!Number(amount)}
          type="primary"
          onClick={() => setVisible(true)}
          block
        >
          Next
        </Button>
      </Col>
      <ConfirmBridge visible={visible} onCancel={setVisible} />
    </Row>
  )
}
export default WormAction

import { useState } from 'react'

import { Button, Col, Row } from 'antd'
import ConfirmBridge from './comfirmBridge'
import { transfer } from 'app/model/wormhole.controller'
import { useDispatch } from 'react-redux'

const WormAction = () => {
  const [visible, setVisible] = useState(false)
  const dispatch = useDispatch()

  const onTransfer = () => {
    dispatch(transfer())
  }
  
  return (
    <Row>
      <Col span={24}>
        <Button type="primary" onClick={onTransfer} block>
          Next
        </Button>
      </Col>
      <ConfirmBridge visible={visible} onCancel={setVisible} />
    </Row>
  )
}
export default WormAction

import { Button, Col, Row } from 'antd'
import { useState } from 'react'
import ConfirmBridge from './comfirmBridge'

const WormAction = () => {
  const [visible, setVisible] = useState(false)

  return (
    <Row>
      <Col span={24}>
        <Button type="primary" onClick={() => setVisible(true)} block>
          Next
        </Button>
      </Col>
      <ConfirmBridge visible={visible} onCancel={setVisible} />
    </Row>
  )
}
export default WormAction

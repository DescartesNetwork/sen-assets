import { Fragment, useState } from 'react'

import IonIcon from '@sentre/antd-ionicon'
import { Button, Col, Modal, Row, Typography } from 'antd'
import Destination from './destination'
import Source from './source'

const ModalSendToken = () => {
  const [visible, setVisible] = useState(false)
  const [dstAddress, setDstAddress] = useState('')
  const [amount, setAmount] = useState('')

  const onCloseModal = () => {
    setVisible(false)
  }

  return (
    <Fragment>
      <Button
        type="primary"
        size="large"
        icon={<IonIcon name="paper-plane-outline" />}
        onClick={() => setVisible(true)}
      >
        Send
      </Button>
      <Modal
        visible={visible}
        footer={false}
        onCancel={onCloseModal}
        centered
        className="modal-sen-assets"
      >
        <Row gutter={[8, 8]}>
          <Col span={24}>
            <Typography.Title level={4}>Send tokens</Typography.Title>
          </Col>
          <Col span={24}>
            <Destination onChange={setDstAddress} value={dstAddress} />
          </Col>
          <Col span={24}>
            <Source accountAddr="" onChange={setAmount} value={amount} />
          </Col>
          <Col span={24}>
            <Button type="primary" block>
              Transfer
            </Button>
          </Col>
        </Row>
      </Modal>
    </Fragment>
  )
}

export default ModalSendToken

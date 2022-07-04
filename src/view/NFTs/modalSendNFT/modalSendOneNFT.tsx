import { ChangeEvent, Fragment, useState } from 'react'
import { isAddress } from '@sentre/utility'
import BN from 'bn.js'

import { Button, Col, Input, Modal, Row, Typography } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import CardSendNFT from './cardSendNFT'
import configs from 'configs'
import { util } from '@sentre/senhub'

const {
  sol: { utility },
} = configs

type ModalSendNFTProps = {
  mintNFT: string
}

const ModalSendOneNFT = ({ mintNFT }: ModalSendNFTProps) => {
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [receiverAddress, setReceiverAddress] = useState('')

  const onCloseModal = () => {
    setVisible(false)
  }

  const onSend = async () => {
    if (!isAddress(receiverAddress))
      return window.notify({
        type: 'error',
        description: 'Invalid mint address',
      })
    setLoading(true)
    try {
      const { txId } = await utility.safeTransfer({
        amount: new BN(1),
        tokenAddress: mintNFT,
        dstWalletAddress: receiverAddress,
      })
      setVisible(false)
      return window.notify({
        type: 'success',
        description: 'Transfer success!',
        onClick: () => window.open(util.explorer(txId), '_blank'),
      })
    } catch (er: any) {
      window.notify({ type: 'error', description: er.message })
    } finally {
      return setLoading(false)
    }
  }

  return (
    <Fragment>
      <Button
        type="primary"
        block
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
        closeIcon={<IonIcon name="close-outline" />}
      >
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Typography.Title level={4}>Send NFT</Typography.Title>
          </Col>
          <Col span={24}>
            <Typography.Text>Receiver Address</Typography.Text>
          </Col>
          <Col span={24}>
            <Input
              size="large"
              placeholder="Recipient’s wallet address..."
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setReceiverAddress(e.target.value)
              }}
            />
          </Col>
          <Col span={24} style={{ padding: 10 }}>
            <CardSendNFT mintNFT={mintNFT} />
          </Col>
          <Col span={24}>
            <Button
              type="primary"
              block
              onClick={onSend}
              loading={loading}
              size="large"
            >
              Send
            </Button>
          </Col>
        </Row>
      </Modal>
    </Fragment>
  )
}

export default ModalSendOneNFT

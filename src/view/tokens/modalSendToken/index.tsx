import { Fragment, useState } from 'react'

import { utils } from '@senswap/sen-js'
import { BN } from 'bn.js'

import IonIcon from '@sentre/antd-ionicon'
import { Button, Col, Modal, Row, Typography } from 'antd'
import Destination from './destination'
import Source from './source'

import { useMintAccount } from 'hooks/useMintAccount'
import { notifyError, notifySuccess } from 'helper'
import { useTransfer } from 'hooks/useTransfer'

const ModalSendToken = () => {
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [accountAddr, setAccountAddr] = useState('')
  const [mintAddress, setMintAddress] = useState('')
  const [dstAddress, setDstAddress] = useState('')
  const [amount, setAmount] = useState('')
  const { mint, decimals } = useMintAccount(accountAddr)
  const { transfer } = useTransfer()
  const onCloseModal = () => {
    setVisible(false)
  }

  const onSend = async () => {
    setLoading(true)
    try {
      const amountBN = new BN(utils.decimalize(amount, decimals).toString())
      const txId = await transfer(dstAddress, amountBN, mint)
      setAmount('')
      setDstAddress('')
      return notifySuccess('Transfer', txId)
    } catch (er: any) {
      return notifyError(er)
    } finally {
      setLoading(false)
    }
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
        open={visible}
        footer={false}
        onCancel={onCloseModal}
        centered
        className="modal-sen-assets"
        closeIcon={<IonIcon name="close-outline" />}
      >
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Typography.Title level={4}>Send tokens</Typography.Title>
          </Col>
          <Col span={24}>
            <Destination onChange={setDstAddress} value={dstAddress} />
          </Col>
          <Col span={24}>
            <Source
              accountAddr={accountAddr}
              amount={amount}
              mintAddress={mintAddress}
              onChange={(accountAddress, amount, mintAddress) => {
                setAccountAddr(accountAddress)
                setMintAddress(mintAddress)
                setAmount(amount)
              }}
            />
          </Col>
          <Col span={24}>
            <Button
              type="primary"
              block
              loading={loading}
              onClick={onSend}
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

export default ModalSendToken

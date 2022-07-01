import { Fragment, useState } from 'react'
import { isAddress } from '@sentre/utility'
import { utils } from '@senswap/sen-js'
import { BN } from 'bn.js'

import IonIcon from '@sentre/antd-ionicon'
import { Button, Col, Modal, Row, Typography } from 'antd'
import Destination from './destination'
import Source from './source'

import configs from 'configs'
import { useMintAccount } from 'hooks/useMintAccount'
import { notifyError, notifySuccess } from 'helper'
import { SOL_ADDRESS } from 'constant/sol'

const {
  sol: { utility },
} = configs

const ModalSendToken = () => {
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [accountAddr, setAccountAddr] = useState('')
  const [mintAddress, setMintAddress] = useState('')
  const [dstAddress, setDstAddress] = useState('')
  const [amount, setAmount] = useState('')
  const { mint, decimals } = useMintAccount(accountAddr)

  const onCloseModal = () => {
    setVisible(false)
  }

  const onSend = async () => {
    if (!isAddress(dstAddress))
      return window.notify({
        type: 'error',
        description: 'Invalid wallet address',
      })

    setLoading(true)
    try {
      const { wallet, lamports } = window.sentre
      if (!wallet) return
      // transfer lamports
      const amountTransfer = utils.decimalize(amount, decimals)
      if (mint === SOL_ADDRESS) {
        const txId = await lamports.transfer(amountTransfer, dstAddress, wallet)
        setAmount('')
        setDstAddress('')
        return notifySuccess('Transfer', txId)
      }
      const { txId } = await utility.safeTransfer({
        amount: new BN(amountTransfer.toString()),
        tokenAddress: mint,
        dstWalletAddress: dstAddress,
      })
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
        visible={visible}
        footer={false}
        onCancel={onCloseModal}
        centered
        className="modal-sen-assets"
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

import { Fragment, useState } from 'react'
import { isAddress } from '@sentre/utility'
import { BN } from 'bn.js'

import IonIcon from '@sentre/antd-ionicon'
import { Button, Col, Modal, Row, Typography } from 'antd'
import Destination from './destination'
import Source from './source'
import configs from 'app/configs'
import { utils } from '@senswap/sen-js'
import { useMintAccount } from 'app/hooks/useMintAccount'
import { explorer } from 'shared/util'

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
      // transfer lamports
      const amountTransfer = utils.decimalize(amount, decimals)
      const { txId } = await utility.safeTransfer({
        amount: new BN(amountTransfer.toString()),
        tokenAddress: mint,
        dstWalletAddress: dstAddress,
      })
      setAmount('')
      window.notify({
        type: 'success',
        description: 'Transfer success!',
        onClick: () => window.open(explorer(txId), '_blank'),
      })
    } catch (er: any) {
      window.notify({ type: 'error', description: er.message })
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
        <Row gutter={[8, 8]}>
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
            <Button type="primary" block loading={loading} onClick={onSend}>
              Send
            </Button>
          </Col>
        </Row>
      </Modal>
    </Fragment>
  )
}

export default ModalSendToken

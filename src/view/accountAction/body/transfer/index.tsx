import { useState } from 'react'
import { account, utils } from '@senswap/sen-js'
import { BN } from 'bn.js'

import { Row, Col, Button } from 'antd'
import Source from './source'
import Destination from './destination'

import { useMintAccount } from 'hooks/useMintAccount'
import { notifyError, notifySuccess } from 'helper'
import { useTransfer } from 'hooks/useTransfer'

const Transfer = ({ accountAddr }: { accountAddr: string }) => {
  const [dstAddress, setDstAddress] = useState('')
  const { mint, decimals } = useMintAccount(accountAddr)
  const [loading, setLoading] = useState(false)
  const [amount, setAmount] = useState('')
  const { transfer } = useTransfer()

  const onTransfer = async () => {
    setLoading(true)
    try {
      const amountBN = new BN(utils.decimalize(amount, decimals).toString())
      const txId = await transfer(dstAddress, amountBN, mint)
      setAmount('')
      setDstAddress('')
      return notifySuccess('Transfer', txId)
    } catch (er) {
      return notifyError(er)
    } finally {
      return setLoading(false)
    }
  }

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Destination onChange={setDstAddress} value={dstAddress} />
      </Col>
      <Col span={24}>
        <Source accountAddr={accountAddr} onChange={setAmount} value={amount} />
      </Col>
      <Col span={24}>
        <Button
          type="primary"
          onClick={onTransfer}
          block
          loading={loading}
          disabled={!Number(amount) || !account.isAddress(dstAddress)}
          size="large"
        >
          Send
        </Button>
      </Col>
    </Row>
  )
}

export default Transfer

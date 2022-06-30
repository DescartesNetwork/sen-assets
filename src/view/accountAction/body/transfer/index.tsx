import { useState } from 'react'
import { account, utils } from '@senswap/sen-js'
import { isAddress } from '@sentre/utility'
import { BN } from 'bn.js'

import { Row, Col, Button } from 'antd'
import Source from './source'
import Destination from './destination'

import { useMintAccount } from 'hooks/useMintAccount'
import { SOL_ADDRESS } from 'constant/sol'
import { notifyError, notifySuccess } from 'helper'
import configs from 'configs'

const {
  sol: { utility },
} = configs

const Transfer = ({ accountAddr }: { accountAddr: string }) => {
  const [dstAddress, setDstAddress] = useState('')
  const { mint, decimals } = useMintAccount(accountAddr)
  const [loading, setLoading] = useState(false)
  const [amount, setAmount] = useState('')

  const transfer = async () => {
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
          onClick={transfer}
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

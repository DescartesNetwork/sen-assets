import { useState } from 'react'
import { account, utils } from '@senswap/sen-js'

import { Row, Col, Button } from 'antd'
import Source from './source'
import Destination from './destination'

import { useMintAccount } from 'app/shared/hooks/useMintAccount'
import { SOL_ADDRESS } from 'app/constant/sol'
import { notifyError, notifySuccess } from 'app/helper'

const Transfer = ({ accountAddr }: { accountAddr: string }) => {
  const [dstAddress, setDstAddress] = useState('')
  const { mint, decimals } = useMintAccount(accountAddr)
  const [loading, setLoading] = useState(false)
  const [amount, setAmount] = useState('0')

  const getDstAssociatedAddr = async (): Promise<string | undefined> => {
    const { splt, wallet } = window.sentre
    if (!wallet) throw new Error('Login first')
    let associatedAddr = dstAddress
    if (!account.isAssociatedAddress(associatedAddr))
      associatedAddr = await splt.deriveAssociatedAddress(dstAddress, mint)
    try {
      // Validate existing account
      await splt.getAccountData(associatedAddr)
    } catch (error) {
      await splt.initializeAccount(mint, dstAddress, wallet)
    }
    return associatedAddr
  }

  const transfer = async () => {
    setLoading(true)
    try {
      const { splt, wallet, lamports } = window.sentre
      if (!wallet) return
      // transfer lamports
      const amountTransfer = utils.decimalize(amount, decimals)
      if (mint === SOL_ADDRESS) {
        const txId = await lamports.transfer(amountTransfer, dstAddress, wallet)
        return notifySuccess('Transfer', txId)
      }
      // transfer splt
      const dstAssociatedAddr = await getDstAssociatedAddr()
      if (!dstAssociatedAddr) throw new Error('Invalid destination address')
      const { txId } = await splt.transfer(
        amountTransfer,
        accountAddr,
        dstAssociatedAddr,
        wallet,
      )
      return notifySuccess('Transfer', txId)
    } catch (er) {
      notifyError(er)
    } finally {
      setLoading(false)
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
          disabled={!Number(amount)}
        >
          Transfer
        </Button>
      </Col>
    </Row>
  )
}

export default Transfer
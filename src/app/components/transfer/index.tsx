import { useState } from 'react'

import { Row, Col, Button } from 'antd'
import Source from './source'
import Destination from './destination'

import { useAccount } from 'senhub/providers'
import { explorer } from 'shared/util'
import { account, utils } from '@senswap/sen-js'
import useMintDecimals from 'app/shared/hooks/useMintDecimals'

const Transfer = ({ accountAddr }: { accountAddr: string }) => {
  const { accounts } = useAccount()
  const [amount, setAmount] = useState<string>('')
  const [dstAddress, setDstAddress] = useState('')
  const [loading, setLoading] = useState(false)

  const { mint, amount: maxAmount } = accounts[accountAddr] || {}
  const decimals = useMintDecimals(mint)

  const disabledTransfer = () => {
    if (!account.isAddress(dstAddress)) return true
    const amountTransfer = utils.decimalize(amount, decimals)
    if (!amountTransfer || amountTransfer > maxAmount) return true
    return false
  }

  const getDstAssociatedAddr = async (): Promise<string | undefined> => {
    const { splt, wallet } = window.sentre
    if (!account.isAddress(dstAddress) || !account.isAddress(mint) || !wallet)
      return

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
      const { splt, wallet } = window.sentre
      if (!wallet) return

      const dstAssociatedAddr = await getDstAssociatedAddr()
      if (!dstAssociatedAddr) throw new Error('Invalid destination address')
      const amountTransfer = utils.decimalize(Number(amount), decimals)
      const { txId } = await splt.transfer(
        amountTransfer,
        accountAddr,
        dstAssociatedAddr,
        wallet,
      )

      window.notify({
        type: 'success',
        description: `Transfer successfully`,
        onClick: () => window.open(explorer(txId), '_blank'),
      })
    } catch (er: any) {
      window.notify({
        type: 'error',
        description: er.message,
      })
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
          disabled={disabledTransfer()}
        >
          Transfer
        </Button>
      </Col>
    </Row>
  )
}

export default Transfer

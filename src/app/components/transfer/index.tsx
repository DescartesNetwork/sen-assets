import { useState } from 'react'
import PropTypes from 'prop-types'
import { account, utils } from '@senswap/sen-js'

import { Row, Col, Button } from 'antd'
import Source from './source'
import { useAccount, useWallet } from 'senhub/providers'
import useMintDecimals from 'app/hooks/useMintDecimals'
import Destination from './destination'

const Transfer = ({ accountAddr }: { accountAddr: string }) => {
  const {
    wallet: { address: walletAddress },
  } = useWallet()
  const { accounts } = useAccount()
  const [amount, setAmount] = useState<string>('')
  const [dstAddress, setDstAddress] = useState('')
  const [loading, setLoading] = useState(false)

  const accountData = accounts[accountAddr] || {}
  const { mint, amount: maxAmount, state } = accountData
  const decimals = useMintDecimals(mint)

  const disabled =
    !amount ||
    Number(amount) > maxAmount ||
    !account.isAddress(dstAddress) ||
    state === 2

  const transfer = async () => {
    setLoading(true)
    try {
      const { splt, wallet } = window.sentre
      if (!wallet) return
      if (!state) await splt.initializeAccount(mint, walletAddress, wallet)

      const amountTransfer = utils.decimalize(Number(amount), decimals)
      const { txId } = await splt.transfer(
        amountTransfer,
        accountAddr,
        dstAddress,
        wallet,
      )
      await window.notify({
        type: 'success',
        description: `Transfer successfully`,
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
        <Button type="primary" onClick={transfer} block loading={loading} disabled={disabled}>
          Transfer
        </Button>
      </Col>
    </Row>
  )
}

Transfer.defaultProps = {
  data: {},
  onChange: () => {},
}

Transfer.propTypes = {
  data: PropTypes.object,
  onChange: PropTypes.func,
}

export default Transfer

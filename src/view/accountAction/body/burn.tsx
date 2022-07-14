import { util } from '@sentre/senhub'
import { utils } from '@senswap/sen-js'
import BN from 'bn.js'

import { Button, Col, Row, Typography } from 'antd'
import { useMintAccount } from 'hooks/useMintAccount'
import { MintSymbol } from '@sen-use/components'
import NumericInput from 'shared/antd/numericInput'
import { useCallback, useState } from 'react'
import { notifySuccess } from 'helper'

const Burn = ({ accountAddr }: { accountAddr: string }) => {
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)

  const mintAccount = useMintAccount(accountAddr)
  let max = mintAccount.balance

  const onBurn = useCallback(async () => {
    try {
      setLoading(true)
      const { splt, wallet } = window.sentre
      const amountBN = new BN(
        utils.decimalize(amount, mintAccount.decimals).toString(),
      )
      const { txId } = await splt.burn(
        BigInt(amountBN.toString()),
        accountAddr,
        mintAccount.mint,
        wallet,
      )
      setAmount('')
      notifySuccess('Burn', txId)
    } catch (er: any) {
      window.notify({ type: 'error', description: er.message })
    } finally {
      setLoading(false)
    }
  }, [accountAddr, amount, mintAccount.decimals, mintAccount.mint])

  return (
    <Row gutter={[18, 18]}>
      <Col span={24}>
        <Row gutter={[8, 8]}>
          <Col flex="auto">
            <Typography.Text>Amount</Typography.Text>
          </Col>
          <Col>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              Available: {util.numeric(mintAccount.balance).format('0,0.[00]a')}{' '}
              <MintSymbol mintAddress={mintAccount.mint} />
            </Typography.Text>
          </Col>
          <Col span={24}>
            <NumericInput
              placeholder="0"
              prefix={
                <Typography.Text type="secondary">
                  <MintSymbol mintAddress={mintAccount.mint} />
                </Typography.Text>
              }
              suffix={
                <Button
                  type="text"
                  style={{ marginRight: -7 }}
                  onClick={() => setAmount(max)}
                >
                  MAX
                </Button>
              }
              value={amount}
              onValue={setAmount}
              max={mintAccount.balance}
            />
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <Button
          type="primary"
          size="large"
          block
          onClick={onBurn}
          loading={loading}
          disabled={!Number(amount)}
        >
          Burn
        </Button>
      </Col>
    </Row>
  )
}

export default Burn

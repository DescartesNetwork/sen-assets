import { DEFAULT_EMPTY_ADDRESS, DEFAULT_WSOL, utils } from '@senswap/sen-js'

import { Row, Col, Typography, Button } from 'antd'
import { MintSymbol } from 'app/shared/components/mint'
import NumericInput from 'app/shared/components/numericInput'

import { useAccount, useWallet } from 'senhub/providers'
import useMintDecimals from 'app/shared/hooks/useMintDecimals'
import { useMemo } from 'react'

const Source = ({
  accountAddr,
  onChange,
  value,
}: {
  accountAddr: string
  onChange: (amount: string) => void
  value: string
}) => {
  const { accounts } = useAccount()

  const { amount: maxAmount, mint } = accounts[accountAddr] || {}
  const decimals = useMintDecimals(mint)
  const balance = utils.undecimalize(maxAmount, decimals)
  const { wallet: { lamports } } = useWallet()
  const balanceSol = utils.undecimalize(lamports, 9)
  const isSolAccount = accountAddr === DEFAULT_EMPTY_ADDRESS || accountAddr === DEFAULT_WSOL

  const sourceBalance = useMemo(() => {
    if (isSolAccount) return balanceSol
    return balance
  }, [isSolAccount, balance, balanceSol])

  return (
    <Row gutter={[8, 8]}>
      <Col span={24}>
        <Typography.Text>Amount</Typography.Text>
      </Col>
      <Col span={24}>
        <NumericInput
          placeholder={0}
          prefix={
            <Typography.Text type="secondary">
              {isSolAccount ? 'SOL' : <MintSymbol mintAddress={mint} />}
            </Typography.Text>
          }
          suffix={
            <Button
              type="text"
              style={{ marginRight: -7 }}
              onClick={() => onChange(sourceBalance)}
            >
              MAX
            </Button>
          }
          value={value}
          onChange={onChange}
          max={sourceBalance}
        />
      </Col>
    </Row>
  )
}

export default Source

import { utils } from '@senswap/sen-js'

import { Row, Col, Typography, Button } from 'antd'
import MintSymbol from 'app/shared/components/mintSymbol'
import NumericInput from 'app/shared/components/numericInput'

import { useAccount } from 'senhub/providers'
import useMintDecimals from 'app/shared/hooks/useMintDecimals'

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
              <MintSymbol mintAddress={mint} />
            </Typography.Text>
          }
          suffix={
            <Button
              type="text"
              style={{ marginRight: -7 }}
              onClick={() => onChange(balance)}
            >
              MAX
            </Button>
          }
          value={value}
          onChange={onChange}
          max={balance}
        />
      </Col>
    </Row>
  )
}

export default Source

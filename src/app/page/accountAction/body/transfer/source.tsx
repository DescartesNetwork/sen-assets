import { Row, Col, Typography, Button } from 'antd'
import { MintSymbol } from 'app/shared/components/mint'
import NumericInput from 'shared/antd/numericInput'

import { useMintAccount } from 'app/shared/hooks/useMintAccount'

const Source = ({
  accountAddr,
  onChange,
  value,
}: {
  accountAddr: string
  onChange: (amount: string) => void
  value: string
}) => {
  const mintAccount = useMintAccount(accountAddr)

  return (
    <Row gutter={[8, 8]}>
      <Col span={24}>
        <Typography.Text>Amount</Typography.Text>
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
              onClick={() => onChange(mintAccount.balance)}
            >
              MAX
            </Button>
          }
          value={value}
          onValue={onChange}
          max={mintAccount.balance}
        />
      </Col>
    </Row>
  )
}

export default Source

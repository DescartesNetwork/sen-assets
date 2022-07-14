import { utils } from '@senswap/sen-js'
import { useWallet, util } from '@sentre/senhub'

import { Row, Col, Typography, Button } from 'antd'
import { MintSymbol } from '@sen-use/components'
import NumericInput from 'shared/antd/numericInput'

import { useMintAccount } from 'hooks/useMintAccount'

const PLATFORM_FEE = BigInt(5000)
const NETWORK_FEE = BigInt(5000)

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
  const {
    wallet: { address, lamports },
  } = useWallet()

  let max = mintAccount.balance
  if (accountAddr === address)
    max = utils.undecimalize(lamports - PLATFORM_FEE - NETWORK_FEE, 9)

  return (
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
              onClick={() => onChange(max)}
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

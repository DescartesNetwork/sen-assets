import { useState } from 'react'
import { utils } from '@senswap/sen-js'

import { Row, Col, Typography, Button } from 'antd'
import SelectMint from './selectMint'
import NumericInput from 'app/shared/components/numericInput'

import { useAccount } from 'senhub/providers'
import useMintDecimals from 'app/shared/hooks/useMintDecimals'

const SelectMintInput = ({
  accountAddr,
  onChange,
  value,
}: {
  accountAddr: string
  onChange: (amount: string) => void
  value: string
}) => {
  const { accounts } = useAccount()
  const [token, setToken] = useState('Select')

  const { amount: maxAmount, mint } = accounts[accountAddr] || {}
  const decimals = useMintDecimals(mint)
  const balance = utils.undecimalize(maxAmount, decimals)

  return (
    <Row gutter={[8, 8]}>
      <Col flex="auto">
        <Typography.Text>Amount</Typography.Text>
      </Col>
      <Col>
        <Typography.Text>Availble: {0}</Typography.Text>
      </Col>
      <Col span={24}>
        <NumericInput
          placeholder={0}
          prefix={<SelectMint value={token} onSelectMint={setToken} />}
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

export default SelectMintInput

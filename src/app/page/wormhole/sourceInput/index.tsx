import { useDispatch, useSelector } from 'react-redux'

import { Row, Col, Typography, Button } from 'antd'
import SourceMintSelect from './sourceMintSelect'
import NumericInput from 'shared/antd/numericInput'

import { AppState } from 'app/model'
import { setSourceToken } from 'app/model/wormhole.controller'

const SelectMintInput = () => {
  const dispatch = useDispatch()
  const { sourceTokens, tokenAddress, amount, processId } = useSelector(
    (state: AppState) => state.wormhole,
  )
  const { amount: maxAmount, symbol } = sourceTokens[tokenAddress] || {}

  const onChange = (amount: string) => dispatch(setSourceToken({ amount }))

  return (
    <Row gutter={[8, 8]}>
      <Col flex="auto">
        <Typography.Text>Amount</Typography.Text>
      </Col>
      <Col>
        <Typography.Text>
          Available: {maxAmount || 0} {symbol}
        </Typography.Text>
      </Col>
      <Col span={24}>
        <NumericInput
          disabled={!tokenAddress || !!processId}
          placeholder="0"
          prefix={<SourceMintSelect />}
          suffix={
            <Button
              type="text"
              style={{ marginRight: -7 }}
              disabled={!tokenAddress || !!processId}
              onClick={() =>
                dispatch(setSourceToken({ amount: `${maxAmount}` }))
              }
            >
              MAX
            </Button>
          }
          value={amount}
          onValue={onChange}
          max={maxAmount}
        />
      </Col>
    </Row>
  )
}

export default SelectMintInput

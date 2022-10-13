import { useDispatch, useSelector } from 'react-redux'

import { Row, Col, Typography, Button, Space } from 'antd'
import SourceMintSelect from './sourceMintSelect'
import NumericInput from 'shared/antd/numericInput'

import { AppDispatch, AppState } from 'model'
import { setSourceToken } from 'model/wormhole.controller'
import { util } from '@sentre/senhub'

const SelectMintInput = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    wormhole: { sourceTokens, tokenAddress, amount, processId },
  } = useSelector((state: AppState) => state)

  const { amount: maxAmount, symbol } = sourceTokens[tokenAddress] || {}
  const onChange = (amount: string) => dispatch(setSourceToken({ amount }))

  return (
    <Row gutter={[0, 8]}>
      <Col flex="auto">
        <Typography.Text>Amount</Typography.Text>
      </Col>
      <Col>
        <Space>
          <Typography.Text type="secondary">Available:</Typography.Text>
          <Typography.Text>
            {util.numeric(maxAmount).format('0,0.[0000]') || 0} {symbol}
          </Typography.Text>
        </Space>
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
          max={maxAmount || '0'}
        />
      </Col>
    </Row>
  )
}

export default SelectMintInput

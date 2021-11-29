import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { utils } from '@senswap/sen-js'

import { Row, Col, Typography, Button, Input } from 'antd'
import IonIcon from 'shared/ionicon'

import { useAccount } from 'senhub/providers'
import useMintDecimals from 'app/hooks/useMintDecimals'
import MintSymbol from '../mint/mintSymbol'

const Source = ({
  accountAddr,
  onChange,
  value
}: {
  accountAddr: string
  onChange: (amount: string) => void
  value:string
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
        <Input
          placeholder={'0'}
          prefix={<MintSymbol mintAddress={mint} />}
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
          onChange={(e) => onChange(e.target.value)}
          max={balance}
        />
      </Col>
    </Row>
  )
}

export default Source

import { utils } from '@senswap/sen-js'
import { Button, Col, Input, Row, Typography } from 'antd'
import useMintDecimals from 'app/shared/hooks/useMintDecimals'

import { useAccount } from 'senhub/providers'
import MintSymbol from '../../../shared/components/mintSymbol'

const Wrapper = ({ accountAddr }: { accountAddr: string }) => {
  const { accounts } = useAccount()

  const { amount: maxAmount, mint } = accounts[accountAddr] || {}
  const decimals = useMintDecimals(mint)
  const balance = utils.undecimalize(maxAmount, decimals)

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Row gutter={[8, 8]}>
          <Col span={24}>
            <Typography.Text>Wrap Amount</Typography.Text>
          </Col>
          <Col span={24}>
            <Input
              size="large"
              placeholder={'0'}
              prefix={<MintSymbol mintAddress={mint} />}
              value={balance}
              max={balance}
            />
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <Button type="primary" block>
          Wrap All
        </Button>
      </Col>
    </Row>
  )
}

export default Wrapper
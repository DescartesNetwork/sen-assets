import { useState } from 'react'

import { Card, Col, Row } from 'antd'
import WormAction from './wormAction'
import WormTitle from './wormTitle'
import WormWallet from './wormWallet'
import SelectMintInput from 'app/components/selectMintInput'

const WormHole = () => {
  const [amount, setAmount] = useState<string>('')

  return (
    <Card className="card-page" bordered={false}>
      <Row gutter={[14, 14]}>
        <Col span={24}>
          <WormTitle />
        </Col>
        <Col span={24}>
          <WormWallet />
        </Col>
        <Col span={24}>
          <SelectMintInput
            accountAddr={''}
            value={amount}
            onChange={setAmount}
          />
        </Col>
        <Col span={24}>
          <WormAction />
        </Col>
      </Row>
    </Card>
  )
}

export default WormHole

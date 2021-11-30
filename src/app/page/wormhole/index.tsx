import { useState } from 'react'

import { Card, Col, Row } from 'antd'
import WormAction from './wormAction'
import WormInput from './wormInput'
import WormTitle from './wormTitle'
import WormWallet from './wormWallet'

const WormHole = () => {
  const [amount, setAmount] = useState<string>('')

  return (
    <Card className="card-page">
      <Row gutter={[14, 14]}>
        <Col span={24}>
          <WormTitle />
        </Col>
        <Col span={24}>
          <WormWallet />
        </Col>
        <Col span={24}>
          <WormInput accountAddr={''} value={amount} onChange={setAmount} />
        </Col>
        <Col span={24}>
          <WormAction />
        </Col>
      </Row>
    </Card>
  )
}

export default WormHole

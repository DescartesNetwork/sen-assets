import { Card, Col, Row, Typography } from 'antd'
import { useEffect, useRef, useState } from 'react'

const WormHold = () => {
  const ref = useRef(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    setHeight((ref?.current as any)?.offsetWidth)
  }, [])

  return (
    <Card style={{ height, overflow: 'auto' }}>
      <Row gutter={[24, 24]} ref={ref}>
        <Col span={24}>
          <Typography.Title level={4}>
            Wormhole <span style={{ color: '#F9575E' }}>Bridge</span>
          </Typography.Title>
        </Col>
      </Row>
    </Card>
  )
}

export default WormHold

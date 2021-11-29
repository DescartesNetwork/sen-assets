import { useEffect, useRef, useState } from 'react'

import { Card, Col, Row } from 'antd'
import Header from './header/header'
import Body from './body/body'

const Balance = () => {
  const ref = useRef(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    setHeight((ref?.current as any)?.offsetWidth - 24)
  }, [])

  return (
    <Card style={{ height, overflow: 'hidden' }} bodyStyle={{ padding: 0 }}>
      <Row ref={ref}>
        <Col span={24}>
          <Header />
        </Col>
        <Col span={24}>
          <Body />
        </Col>
      </Row>
    </Card>
  )
}

export default Balance

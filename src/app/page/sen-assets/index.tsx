import { Card, Col, Row } from 'antd'

import CardHeader from './header/header'
import ListAccount from './content/listAccount'

import { useEffect, useRef, useState } from 'react'

const SenAssets = () => {
  const ref = useRef(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    setHeight((ref?.current as any)?.offsetWidth)
  }, [])

  return (
    <Card style={{ height, overflow: 'auto' }}>
      <Row gutter={[24, 24]} ref={ref}>
        <Col span={24}>
          <CardHeader />
        </Col>
        <Col span={24}>
          <Row gutter={[12, 12]}>
            <ListAccount />
          </Row>
        </Col>
      </Row>
    </Card>
  )
}
export default SenAssets

import { useHistory } from 'react-router-dom'

import { Button, Col, Empty, Row } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

const PageNotFound = () => {
  const history = useHistory()

  return (
    <Row justify="center">
      <Col span={24} style={{ textAlign: 'center' }}>
        <Empty description="Page not found" />
      </Col>
      <Col span={24} style={{ textAlign: 'center' }}>
        <Button
          type="text"
          icon={<IonIcon name="arrow-back-outline" />}
          onClick={() => history.push(`/`)}
        >
          Go Back Home
        </Button>
      </Col>
    </Row>
  )
}

export default PageNotFound

import { useHistory } from 'react-router-dom'

import { Button, Col, Empty, Row } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import configs from 'configs'

const {
  manifest: { appId },
} = configs
const appPath = '/app/' + appId

const PageNotFound = () => {
  const history = useHistory()

  return (
    <Row gutter={[24, 24]} justify="center">
      <Col span={24} style={{ textAlign: 'center' }}>
        <Empty description="Page not found" />
      </Col>
      <Col span={24} style={{ textAlign: 'center' }}>
        <Button
          type="text"
          icon={<IonIcon name="arrow-back-outline" />}
          onClick={() => history.push(appPath)}
        >
          Go Back Home
        </Button>
      </Col>
    </Row>
  )
}

export default PageNotFound

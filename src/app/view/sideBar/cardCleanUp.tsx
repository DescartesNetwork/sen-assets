import { useHistory } from 'react-router-dom'

import IonIcon from '@sentre/antd-ionicon'
import { Button, Card, Col, Row, Typography } from 'antd'

import configs from 'app/configs'

import IconSenAsset from 'app/static/images/icon_senasset.png'

const {
  manifest: { appId },
} = configs
const appPath = '/app/' + appId

const CardCleanUp = () => {
  const history = useHistory()

  return (
    <Card
      bordered={false}
      className="card-cleanup"
      style={{ boxShadow: 'none' }}
    >
      <img
        className="card-cleanup-image"
        src={IconSenAsset}
        alt="Icon SenAssets"
      />
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <Typography.Text style={{ fontSize: '12px' }}>
            Extra Features
          </Typography.Text>
        </Col>
        <Col span={24}>
          <Typography.Title level={5}>
            SenAsset Product Advertisement
          </Typography.Title>
        </Col>
        <Col span={24}>
          <Typography.Text style={{ fontSize: '12px' }}>
            Help clean up your tokens when the value is $0.
          </Typography.Text>
        </Col>
        <Col span={24}>
          <Button
            icon={<IonIcon name="sparkles-outline" />}
            block
            onClick={() => history.push(appPath + '/sweepers')}
          >
            Sweepers
          </Button>
        </Col>
      </Row>
    </Card>
  )
}

export default CardCleanUp

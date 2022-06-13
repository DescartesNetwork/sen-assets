import IonIcon from '@sentre/antd-ionicon'
import { Button, Card, Col, Row, Typography } from 'antd'

import IconSenAsset from 'app/static/images/icon_senasset.png'

const CardCleanUp = () => {
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
            Help clean up your token list by converting tokens with an amount
            less than $1 into SOL tokens.
            <Typography.Link href="/"> Read More</Typography.Link>
          </Typography.Text>
        </Col>
        <Col span={24}>
          <Button icon={<IonIcon name="sparkles-outline" />} block>
            Clean up
          </Button>
        </Col>
      </Row>
    </Card>
  )
}

export default CardCleanUp

import { useRef, useState } from 'react'

import IonIcon from '@sentre/antd-ionicon'
import { Row, Col, Space, Typography, Card, Button } from 'antd'
import ListTokenSweep from './listTokenSweep/index'

type ListTokenSweepRefType = {
  sweepAccounts: () => void
}

const Sweepers = () => {
  const listTokenSweepRef = useRef<ListTokenSweepRefType>(null)
  const [loading, setLoading] = useState(false)

  const sweep = async () => {
    if (listTokenSweepRef.current) {
      listTokenSweepRef.current.sweepAccounts()
    }
  }

  return (
    <Row justify="center" align="middle">
      <Col xs={24} md={16} lg={16} xl={16} xxl={12}>
        <Space direction="vertical" size={24} style={{ maxWidth: 692 }}>
          <Row>
            <Col flex="auto">
              <Typography.Title level={2}>Sweeper</Typography.Title>
            </Col>
            <Col>
              <Button
                size="large"
                icon={
                  <IonIcon name="trash-bin-outline" style={{ fontSize: 18 }} />
                }
                onClick={sweep}
                loading={loading}
              >
                Sweep
              </Button>
            </Col>
          </Row>
          <Card className="card-page-container">
            <Row gutter={[14, 14]}>
              <Col span={24}>
                <Typography.Text type="secondary">
                  <IonIcon
                    name="information-circle-outline"
                    style={{ fontSize: 14 }}
                  />{' '}
                  Your tokens with a value of $0 will be listed below.
                </Typography.Text>
              </Col>
              <Col span={24}>
                <ListTokenSweep
                  ref={listTokenSweepRef}
                  setLoadingBtn={setLoading}
                />
              </Col>
            </Row>
          </Card>
        </Space>
      </Col>
    </Row>
  )
}

export default Sweepers

import { Row, Col, Card, Typography, Button, Image, Space } from 'antd'

import configs from 'app/configs'

import IMAGE_DEFAULT from 'app/static/images/avatar.png'

const {
  sol: { metaplexNFT },
} = configs

const DetailsNFT = () => {
  const getData = async () => {
    const data = await metaplexNFT.getNftMetadata(
      '31jFWVzitgoLzLv2akLitidPNVm4Q4iedcWtDzFowXck',
    )
    console.log('data:', data)
  }
  return (
    <Row gutter={[24, 24]} justify="center" align="middle">
      <Col xs={24} md={16} lg={16} xl={12} xxl={12}>
        <Card className="card-page card-sen-assets scrollbar">
          {/* Header */}
          <Row>
            <Col span={24} style={{ textAlign: 'center' }} onClick={getData}>
              <Typography.Title level={3}>Okay Bear #3690</Typography.Title>
            </Col>
            <Col span={24}>
              <Row gutter={[24, 24]}>
                <Col span={8}>
                  <Space size={12} direction="vertical">
                    <Image
                      src={IMAGE_DEFAULT}
                      preview={false}
                      style={{ borderRadius: 4 }}
                    />
                    <Button type="primary" block>
                      Send
                    </Button>
                  </Space>
                </Col>
                <Col span={16}>
                  <Row gutter={[24, 24]}>
                    <Col span={24}>
                      <Card bordered={false} style={{ height: '200px' }}>
                        <Row>
                          <Col flex="auto">
                            <Typography.Title level={4}>
                              Attributes
                            </Typography.Title>
                          </Col>
                        </Row>
                      </Card>
                    </Col>
                    <Col span={24}>
                      <Card bordered={false} style={{ height: '200px' }}>
                        <Row>
                          <Col flex="auto">
                            <Typography.Title level={4}>
                              Description
                            </Typography.Title>
                          </Col>
                        </Row>
                      </Card>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  )
}

export default DetailsNFT

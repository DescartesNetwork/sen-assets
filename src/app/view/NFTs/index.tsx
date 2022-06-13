import { Row, Col, Card, Typography } from 'antd'
import Settings from '../tokens/settings'

import ListNFTs from './listNFTs'
import Search from './search.tsx'

const NFTs = () => {
  return (
    <Row gutter={[24, 24]} justify="center" align="middle">
      <Col xs={24} md={16} lg={16} xl={12} xxl={12}>
        <Card className="card-page">
          {/* Header */}
          <Row gutter={[24, 24]}>
            <Col flex="auto">
              <Typography.Title level={4}>Sen Assets</Typography.Title>
            </Col>
            <Col>
              <Settings />
            </Col>
            {/* Body + Search */}
            <Col span={24}>
              <Row gutter={[12, 12]}>
                <Col span={24}>
                  <Search />
                </Col>
                <Col span={24}>
                  <ListNFTs />
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  )
}

export default NFTs

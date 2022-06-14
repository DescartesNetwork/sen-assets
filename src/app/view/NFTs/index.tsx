import { Row, Col, Card, Typography } from 'antd'
import Settings from '../tokens/settings'

import ListNFTs from './listNFTs'
import Search from './search.tsx'

const NFTs = () => {
  return (
    <Row gutter={[24, 24]} justify="center" align="middle">
      <Card className="card-page">
        {/* Header */}
        <Row gutter={[24, 24]} justify="center" align="middle">
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
    </Row>
  )
}

export default NFTs

import { Row, Col, Card, Typography } from 'antd'
import Settings from './settings'

import ListNFTs from './listNFTs'
import Search from './search.tsx'
import { useState } from 'react'

const NFTs = () => {
  const [searchText, setSearchText] = useState<string>('')

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
                <Search
                  searchText={searchText}
                  onSearch={(value) => setSearchText(value)}
                />
              </Col>
              <Col span={24}>
                <ListNFTs searchText={searchText} />
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
    </Row>
  )
}

export default NFTs

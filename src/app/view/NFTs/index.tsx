import { useState } from 'react'

import { Row, Col, Typography } from 'antd'

import ListNFTs from './listNFTs'
import Search from './search.tsx'

const NFTs = () => {
  const [searchText, setSearchText] = useState<string>('')

  return (
    <Row gutter={[24, 24]} justify="center" align="middle">
      <Col flex="auto">
        <Typography.Title level={4}>Sen Assets</Typography.Title>
      </Col>
      <Col>
        <Search
          searchText={searchText}
          onSearch={(value) => setSearchText(value)}
        />
      </Col>
      {/* Body + Search */}
      <Col span={24}>
        <Row gutter={[12, 12]}>
          <Col span={24}>
            <ListNFTs searchText={searchText} />
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default NFTs

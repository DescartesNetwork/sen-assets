import { useState } from 'react'

import { Row, Col, Typography } from 'antd'

import ListNFTs from './listNFTs'
import Search from './search.tsx'
import { useWidth } from '@sentre/senhub'

const NFTs = () => {
  const width = useWidth()
  const isMobile = width < 992
  const [searchText, setSearchText] = useState<string>('')

  return (
    <Row gutter={[24, 24]} align="middle">
      <Col flex="auto">
        <Typography.Title level={2}>NFT Assets</Typography.Title>
      </Col>
      <Col span={isMobile ? 24 : undefined}>
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

import { Row, Col } from 'antd'

import ListNFTs from './listNFTs'
import Search from './search.tsx'

const NFTs = () => {
  return (
    <Row gutter={[12, 12]} className="scrollbar">
      <Col span={24}>
        <Search />
      </Col>
      <Col span={24}>
        <ListNFTs />
      </Col>
    </Row>
  )
}

export default NFTs

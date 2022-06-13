import LazyLoad from '@sentre/react-lazyload'

import { Row, Col } from 'antd'
import CardNFT from '../cardNFT'

const ListNFTs = () => {
  return (
    <Row gutter={[24, 24]} className="scrollbar" style={{ height: 400 }}>
      <Col xs={12} md={6} style={{ textAlign: 'center' }}>
        <LazyLoad height={198}>
          <CardNFT />
        </LazyLoad>
      </Col>
      <Col xs={12} md={6} style={{ textAlign: 'center' }}>
        <LazyLoad height={198}>
          <CardNFT />
        </LazyLoad>
      </Col>
      <Col xs={12} md={6} style={{ textAlign: 'center' }}>
        <LazyLoad height={198}>
          <CardNFT />
        </LazyLoad>
      </Col>
      <Col xs={12} md={6} style={{ textAlign: 'center' }}>
        <LazyLoad height={198}>
          <CardNFT />
        </LazyLoad>
      </Col>
      <Col xs={12} md={6} style={{ textAlign: 'center' }}>
        <LazyLoad height={198}>
          <CardNFT />
        </LazyLoad>
      </Col>
      <Col xs={12} md={6} style={{ textAlign: 'center' }}>
        <LazyLoad height={198}>
          <CardNFT />
        </LazyLoad>
      </Col>
      <Col xs={12} md={6} style={{ textAlign: 'center' }}>
        <LazyLoad height={198}>
          <CardNFT />
        </LazyLoad>
      </Col>
      <Col xs={12} md={6} style={{ textAlign: 'center' }}>
        <LazyLoad height={198}>
          <CardNFT />
        </LazyLoad>
      </Col>
      <Col xs={12} md={6} style={{ textAlign: 'center' }}>
        <LazyLoad height={198}>
          <CardNFT />
        </LazyLoad>
      </Col>
      <Col xs={12} md={6} style={{ textAlign: 'center' }}>
        <LazyLoad height={198}>
          <CardNFT />
        </LazyLoad>
      </Col>
      <Col xs={12} md={6} style={{ textAlign: 'center' }}>
        <LazyLoad height={198}>
          <CardNFT />
        </LazyLoad>
      </Col>
    </Row>
  )
}

export default ListNFTs

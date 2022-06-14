import { useMemo } from 'react'
import { useUI } from '@senhub/providers'

import { Row, Col, Typography, Image } from 'antd'

import IMAGE_DEFAULT from 'app/static/images/avatar.png'

export type CardNFTProps = {
  mintAddress?: string
  onSelect?: (mintAddress: string) => void
}

const CardNFT = ({ mintAddress, onSelect }: CardNFTProps) => {
  return (
    <Row gutter={[8, 8]}>
      <Col span={24} style={{ textAlign: 'center' }}>
        <Image
          className="preferably-square"
          src={IMAGE_DEFAULT}
          preview={false}
          style={{ borderRadius: 4 }}
        />
      </Col>
      <Col span={24} style={{ textAlign: 'center' }}>
        <Typography.Text>ABCBABCBBC</Typography.Text>
      </Col>
    </Row>
  )
}

export default CardNFT

import { useMemo } from 'react'
import { useUI } from '@senhub/providers'

import { Row, Col, Typography, Image } from 'antd'

import IMAGE_DEFAULT from 'app/static/images/avatar.png'

export type CardNFTProps = {
  mintAddress?: string
  onSelect?: (mintAddress: string) => void
}

const SIZE_DESKTOP = 150
const SIZE_MOBILE = 130

const CardNFT = ({ mintAddress, onSelect }: CardNFTProps) => {
  const {
    ui: { width },
  } = useUI()

  const imageSize = useMemo(() => {
    if (width < 768) return SIZE_MOBILE
    return SIZE_DESKTOP
  }, [width])

  return (
    <Row gutter={[8, 8]}>
      <Col span={24} style={{ textAlign: 'center', width: imageSize }}>
        <Image
          src={IMAGE_DEFAULT}
          preview={false}
          style={{ borderRadius: 4 }}
          width={imageSize}
          height={imageSize}
        />
      </Col>
      <Col span={24} style={{ textAlign: 'center' }}>
        <Typography.Text>ABCBABCBBC</Typography.Text>
      </Col>
    </Row>
  )
}

export default CardNFT

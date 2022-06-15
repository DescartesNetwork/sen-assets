import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'

import { Row, Col, Typography, Image, Spin } from 'antd'

import IMAGE_DEFAULT from 'app/static/images/avatar.png'
import useNftMetaData from 'app/hooks/useNftMetaData'

export type CardNFTProps = {
  mintAddress: string
  onSelect?: (mintAddress: string) => void
  isShowName?: boolean
  size?: number
}

const CardNFT = ({
  mintAddress,
  onSelect,
  isShowName = true,
  size,
}: CardNFTProps) => {
  const [nftImg, setNftImg] = useState('')
  const [loading, setLoading] = useState(false)
  const { metadata } = useNftMetaData(mintAddress)
  const metadataData = metadata?.data.data

  const getNftInfoFromURI = useCallback(async () => {
    if (!metadata) return setNftImg(IMAGE_DEFAULT)
    try {
      setLoading(true)
      const url = metadata.data.data.uri
      if (!url) return setNftImg(IMAGE_DEFAULT)

      const response = await axios.get(url)
      const img = response.data.image
      return setNftImg(img)
    } catch (er: any) {
      return window.notify({ type: 'error', description: er.message })
    } finally {
      setLoading(false)
    }
  }, [metadata])

  useEffect(() => {
    getNftInfoFromURI()
  }, [getNftInfoFromURI])

  return (
    <Spin spinning={loading}>
      <Row
        gutter={[8, 8]}
        style={{ cursor: 'pointer' }}
        onClick={() => (onSelect ? onSelect(mintAddress) : null)}
      >
        <Col
          span={24}
          style={{ textAlign: 'center', width: size || undefined }}
        >
          <Image
            className="square"
            src={nftImg}
            preview={false}
            style={{ borderRadius: 4 }}
          />
        </Col>
        {isShowName && (
          <Col span={24} style={{ textAlign: 'center' }}>
            <Typography.Text>{metadataData?.name}</Typography.Text>
          </Col>
        )}
      </Row>
    </Spin>
  )
}

export default CardNFT

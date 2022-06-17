import { Row, Col, Typography, Image, Spin } from 'antd'

import IMAGE_DEFAULT from 'app/static/images/nft.jpeg'
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
  const { metadata, loading, nftInfo } = useNftMetaData(mintAddress)
  const metadataData = metadata?.data.data

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
            src={nftInfo?.image || IMAGE_DEFAULT}
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

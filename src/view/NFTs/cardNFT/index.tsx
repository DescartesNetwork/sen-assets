import { Row, Col, Typography, Image, Spin, Space } from 'antd'

import IMAGE_DEFAULT from 'static/images/nft.jpeg'
import useNftMetaData from 'hooks/useNftMetaData'

import Address from './address'

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
      <Row gutter={[16, 16]} style={{ cursor: 'pointer' }}>
        <Col
          span={24}
          style={{ textAlign: 'center', width: size || undefined }}
          onClick={() => (onSelect ? onSelect(mintAddress) : null)}
        >
          <Image
            className="square"
            src={nftInfo?.image || IMAGE_DEFAULT}
            preview={false}
            style={{ borderRadius: 4 }}
          />
        </Col>
        {isShowName && (
          <Col span={24} style={{ textAlign: 'left' }}>
            <Space size={4} direction="vertical">
              <Typography.Title level={5}>
                {metadataData?.name}
              </Typography.Title>
              <Address address={mintAddress} />
            </Space>
          </Col>
        )}
      </Row>
    </Spin>
  )
}

export default CardNFT

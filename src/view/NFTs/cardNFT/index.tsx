import { useEffect } from 'react'

import { Row, Col, Typography, Image, Spin, Button, Space } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import Address from './address'

import useNftMetaData from 'hooks/useNftMetaData'

import IMAGE_DEFAULT from 'static/images/nft-default.png'

export type CardNFTProps = {
  mintAddress: string
  onSelect?: (mintAddress: string) => void
  isShowName?: boolean
  size?: number
  checkNFTUnknown?: (mintAddress: string, isUnkown: boolean) => void
}

const CardNFT = ({
  mintAddress,
  onSelect,
  isShowName = true,
  size,
  checkNFTUnknown,
}: CardNFTProps) => {
  const { loading, nftInfo, metadata, isUnknownNFT } =
    useNftMetaData(mintAddress)

  const onSocialMedia = () => {
    window.open('https://magiceden.io/item-details/' + mintAddress, '_blank')
  }

  useEffect(() => {
    if (checkNFTUnknown && isUnknownNFT) {
      checkNFTUnknown(mintAddress, true)
    }
  }, [checkNFTUnknown, isUnknownNFT, loading, mintAddress, nftInfo])

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
            <Row gutter={[8, 8]}>
              <Col span={24}>
                <Typography.Title ellipsis={{ tooltip: true }} level={5}>
                  {nftInfo?.name || metadata?.data.data.name}
                </Typography.Title>
              </Col>
              <Col span={24}>
                <Space size={0}>
                  <Address address={mintAddress} />
                  <Button
                    type="text"
                    icon={<IonIcon name="earth-outline" />}
                    onClick={onSocialMedia}
                  />
                </Space>
              </Col>
            </Row>
          </Col>
        )}
      </Row>
    </Spin>
  )
}

export default CardNFT

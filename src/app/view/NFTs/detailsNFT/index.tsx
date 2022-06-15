import { useParams } from 'react-router-dom'

import { Row, Col, Card, Typography, Space } from 'antd'
import CardNFT from '../cardNFT'
import Back from './back'
import CardAttributes from './cardAttributes'
import CardDescription from './cardDescription'
import useNftMetaData from 'app/hooks/useNftMetaData'
import Logo from './logo'
import ModalSendNFT from '../modalSendNFT'

const DetailsNFT = () => {
  let { mintNFT } = useParams<{ mintNFT: string }>()
  const { metadata, nftInfo } = useNftMetaData(mintNFT)
  const metadataData = metadata?.data.data

  console.log('metadata: ', metadata, nftInfo, metadata?.info.owner.toBase58())
  return (
    <Row gutter={[24, 24]} justify="center" align="middle">
      <Card className="card-page card-sen-assets scrollbar">
        <Row gutter={[24, 24]} justify="center">
          <Col xs={24} md={8}>
            <Space direction="vertical" size={8}>
              <Back />
              <Space size={12} direction="vertical">
                <CardNFT mintAddress={mintNFT} isShowName={false} />
                <ModalSendNFT mintNFT={mintNFT} />
              </Space>
            </Space>
          </Col>
          <Col xs={24} md={16}>
            <Row gutter={[8, 8]}>
              <Col span={24}>
                <Typography.Title level={3}>
                  {metadataData?.name}
                </Typography.Title>
              </Col>
              <Col span={24}>
                <Logo name={metadataData?.name} />
              </Col>
              <Col span={24}>
                <CardAttributes mintNFT={mintNFT} />
              </Col>
              <Col span={24}>
                <CardDescription mintNFT={mintNFT} />
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
    </Row>
  )
}

export default DetailsNFT

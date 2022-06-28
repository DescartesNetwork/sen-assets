import { useParams } from 'react-router-dom'

import { Row, Col, Card, Typography } from 'antd'
import CardNFT from '../cardNFT'
import Back from './back'
import CardAttributes from './cardAttributes'
import CardDescription from './cardDescription'
import useNftMetaData from 'app/hooks/useNftMetaData'
import Logo from './logo'
import ModalSendOneNFT from '../modalSendNFT/modalSendOneNFT'

const DetailsNFT = () => {
  let { mintNFT } = useParams<{ mintNFT: string }>()
  const { metadata } = useNftMetaData(mintNFT)
  const metadataData = metadata?.data.data

  return (
    <Row gutter={[16, 16]} justify="center" align="middle">
      <Col span={24}>
        <Back />
      </Col>
      <Col span={24}>
        <Card className="card-sen-assets scrollbar">
          <Row gutter={[24, 24]} justify="center">
            <Col xs={24} md={6}>
              <CardNFT mintAddress={mintNFT} isShowName={false} />
            </Col>
            <Col xs={24} md={18}>
              <Row gutter={[8, 8]}>
                <Col flex="auto">
                  <Typography.Title level={3}>
                    {metadataData?.name}
                  </Typography.Title>
                </Col>
                <Col>
                  <ModalSendOneNFT mintNFT={mintNFT} />
                </Col>
                <Col span={24}>
                  <Logo name={metadataData?.name} mintAddress={mintNFT} />
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
      </Col>
    </Row>
  )
}

export default DetailsNFT

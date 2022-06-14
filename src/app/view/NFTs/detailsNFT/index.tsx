import { useLocation, useParams, useRouteMatch } from 'react-router-dom'

import { Row, Col, Card, Typography, Button, Space } from 'antd'
import CardNFT from '../cardNFT'
import Back from './back'
import CardAttributes from './cardAttributes'
import CardDescription from './cardDescription'

import configs from 'app/configs'
import useNftMetaData from 'app/hooks/useNftMetaData'

const {
  sol: { metaplexNFT },
} = configs

const DetailsNFT = () => {
  let { mintNFT } = useParams<{ mintNFT: string }>()
  const { metadata, nftInfo } = useNftMetaData(mintNFT)
  const metadataData = metadata?.data.data

  console.log('metadata: ', metadata, nftInfo)
  return (
    <Row gutter={[24, 24]} justify="center" align="middle">
      <Card className="card-page card-sen-assets scrollbar">
        <Row gutter={[24, 24]} justify="center">
          <Col span={8}>
            <Space direction="vertical" size={8}>
              <Back />
              <Space size={12} direction="vertical">
                <CardNFT mintAddress={mintNFT} isShowName={false} />
                <Button type="primary" block>
                  Send
                </Button>
              </Space>
            </Space>
          </Col>
          <Col span={16}>
            <Row gutter={[8, 8]}>
              <Col span={24}>
                <Typography.Title level={3}>
                  {metadataData?.name}
                </Typography.Title>
              </Col>
              <Col span={24}>
                <CardAttributes mintNFT={mintNFT} />
              </Col>
              <Col span={24}>
                <CardDescription />
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
    </Row>
  )
}

export default DetailsNFT

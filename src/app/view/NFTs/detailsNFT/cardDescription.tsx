import IonIcon from '@sentre/antd-ionicon'
import { Card, Row, Col, Space, Typography } from 'antd'
import useNftMetaData from 'app/hooks/useNftMetaData'

type CardDescriptionProps = {
  mintNFT: string
}

const CardDescription = ({ mintNFT }: CardDescriptionProps) => {
  const { nftInfo } = useNftMetaData(mintNFT)
  console.log('CardDescription: ', nftInfo)
  return (
    <Card className="card-cleanup" bordered={false} style={{ height: '200px' }}>
      <Row gutter={[0, 24]}>
        <Col span={24}>
          <Space>
            <IonIcon name="layers" style={{ fontSize: 24 }} />
            <Typography.Title level={4}>Description</Typography.Title>
          </Space>
        </Col>
        <Col span={24}>
          <Typography.Text>{nftInfo?.description}</Typography.Text>
        </Col>
      </Row>
    </Card>
  )
}

export default CardDescription

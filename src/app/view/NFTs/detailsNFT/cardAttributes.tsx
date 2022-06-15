import { Card, Row, Col, Typography, Space } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import useNftMetaData from 'app/hooks/useNftMetaData'

export type Attribute = {
  trait_type: string
  value: string
}

const ItemAttribute = ({ attribute }: { attribute: Attribute }) => {
  return (
    <Card className="nft-card-item-attribute" bodyStyle={{ padding: 12 }}>
      <Space direction="vertical" style={{ width: '100%' }} align="center">
        <Typography.Text style={{ fontSize: 12 }}>
          {attribute.trait_type}
        </Typography.Text>
        <Typography.Text style={{ fontSize: 14 }} strong>
          {attribute.value}
        </Typography.Text>
        {/* <Typography.Text type="secondary">12% have this trait</Typography.Text> */}
      </Space>
    </Card>
  )
}

const CardAttributes = ({ mintNFT }: { mintNFT: string }) => {
  const { nftInfo } = useNftMetaData(mintNFT)
  return (
    <Card className="card-cleanup" bordered={false}>
      <Row gutter={[0, 24]}>
        <Col span={24}>
          <Space>
            <IonIcon name="layers" style={{ fontSize: 24 }} />
            <Typography.Title level={4}>Attributes</Typography.Title>
          </Space>
        </Col>
        <Col span={24}>
          <Row gutter={[24, 24]}>
            {nftInfo?.attributes?.map((item: Attribute, index: number) => (
              <Col key={index}>
                <ItemAttribute attribute={item} />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Card>
  )
}

export default CardAttributes

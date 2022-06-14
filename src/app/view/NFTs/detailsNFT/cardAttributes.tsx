import { Card, Row, Col, Typography, Space } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import useNftMetaData from 'app/hooks/useNftMetaData'

export type Attribute = {
  trait_type: string
  value: string
}

const ItemAttribute = () => {
  return (
    <Card className="nft-card-item-attribute" bodyStyle={{ padding: 12 }}>
      <Space direction="vertical" style={{ width: '100%' }} align="center">
        <Typography.Text style={{ fontSize: 12 }}>BACKGROUND</Typography.Text>
        <Typography.Text style={{ fontSize: 14 }} strong>
          Black
        </Typography.Text>
        {/* <Typography.Text type="secondary">12% have this trait</Typography.Text> */}
      </Space>
    </Card>
  )
}

type CardAttributesProps = {
  listAttribute: Attribute[]
}

const CardAttributes = ({ mintNFT }: { mintNFT: string }) => {
  const { metadata, nftInfo } = useNftMetaData(mintNFT)
  if (!metadata) return null
  console.log('CardAttributes', metadata, nftInfo)
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
            {/* {listAttribute.map((item) => (
              <Col>
                <ItemAttribute />
              </Col>
            ))} */}
          </Row>
        </Col>
      </Row>
    </Card>
  )
}

export default CardAttributes

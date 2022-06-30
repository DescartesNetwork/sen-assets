import { Card, Row, Col, Typography, Space, Collapse } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import useNftMetaData from 'hooks/useNftMetaData'

export type Attribute = {
  trait_type: string
  value: string
}

const ItemAttribute = ({ attribute }: { attribute: Attribute }) => {
  return (
    <Card className="nft-card-item-attribute" bodyStyle={{ padding: 12 }}>
      <Row gutter={[0, 4]} align="middle">
        <Col span={24} style={{ textAlign: 'center' }}>
          <Typography.Text
            ellipsis={{ tooltip: true }}
            style={{ fontSize: 12 }}
          >
            {attribute.trait_type}
          </Typography.Text>
        </Col>
        <Col span={24} style={{ textAlign: 'center' }}>
          <Typography.Text
            ellipsis={{ tooltip: true }}
            style={{ fontSize: 14 }}
            strong
          >
            {attribute.value}
          </Typography.Text>
        </Col>
      </Row>
    </Card>
  )
}

const CardAttributes = ({ mintNFT }: { mintNFT: string }) => {
  const { nftInfo } = useNftMetaData(mintNFT)
  return (
    <Collapse
      bordered={false}
      defaultActiveKey={['Attributes']}
      className="nft-element-collapse-custom-collapse"
      expandIconPosition="end"
    >
      <Collapse.Panel
        header={
          <Space>
            <IonIcon name="layers-outline" style={{ fontSize: 24 }} />
            <Typography.Title level={4}>Attributes</Typography.Title>
          </Space>
        }
        key="Attributes"
      >
        <Row gutter={[24, 24]} style={{ paddingTop: 16 }}>
          {nftInfo?.attributes?.map((item: Attribute, index: number) => (
            <Col md={8} xs={''} key={index}>
              <ItemAttribute attribute={item} />
            </Col>
          ))}
        </Row>
      </Collapse.Panel>
    </Collapse>
  )
}

export default CardAttributes

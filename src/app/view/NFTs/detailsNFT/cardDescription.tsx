import IonIcon from '@sentre/antd-ionicon'
import { Row, Col, Space, Typography, Collapse } from 'antd'
import useNftMetaData from 'app/hooks/useNftMetaData'

type CardDescriptionProps = {
  mintNFT: string
}

const CardDescription = ({ mintNFT }: CardDescriptionProps) => {
  const { nftInfo } = useNftMetaData(mintNFT)
  return (
    <Collapse
      bordered={false}
      defaultActiveKey={['1']}
      className="nft-element-collapse-custom-collapse"
      expandIconPosition="end"
    >
      <Collapse.Panel
        header={
          <Space>
            <IonIcon name="list-outline" style={{ fontSize: 24 }} />
            <Typography.Title level={4}>Description</Typography.Title>
          </Space>
        }
        key="Description"
      >
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Typography.Text>{nftInfo?.description}</Typography.Text>
          </Col>
        </Row>
      </Collapse.Panel>
    </Collapse>
  )
}

export default CardDescription

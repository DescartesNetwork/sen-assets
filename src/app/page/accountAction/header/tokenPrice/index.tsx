import { Col, Divider, Row, Space, Typography, Avatar } from 'antd'
import { MintAvatar, MintSymbol } from 'app/shared/components/mint'
import Price, { PriceChange, PriceIndicator } from 'app/components/price'
import IonIcon from 'shared/ionicon'

export const TokenPrice = ({ mintAddress, solWallet = false }: { mintAddress: string, solWallet?: boolean | string }) => {
  return (
    <Row>
      <Col flex="auto">
        {!solWallet ? <Space>
          <MintAvatar mintAddress={mintAddress} />
          <Typography.Title className="title-color" level={5}>
            <MintSymbol mintAddress={mintAddress} />
          </Typography.Title>
        </Space> :
          <Space>
            <Avatar src={solWallet} size={24}>
              <IonIcon name="diamond-outline" />
            </Avatar>
            <Typography.Title className="title-color" level={5}>SOL</Typography.Title>
          </Space>}
      </Col>
      <Col>
        <Space size={1} align="end">
          <PriceIndicator mintAddress={mintAddress} colorized />
          <PriceChange mintAddress={mintAddress} colorized />
          <Divider
            className="text-secondary"
            type="vertical"
            style={{ padding: 0 }}
          />
          <Typography.Text className="text-color">
            <Price mintAddress={mintAddress} />
          </Typography.Text>
        </Space>
      </Col>
    </Row>
  )
}

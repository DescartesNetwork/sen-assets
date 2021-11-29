import { Col, Divider, Row, Space, Typography } from 'antd'
import MintAvatar from 'app/shared/components/mintAvatar'
import MintSymbol from 'app/shared/components/mintSymbol'
import Price, { PriceChange, PriceIndicator } from 'app/components/price'

export const TokenPrice = ({ mintAddress }: { mintAddress: string }) => {
  return (
    <Row>
      <Col flex="auto">
        <Space>
          <MintAvatar mintAddress={mintAddress} />
          <Typography.Title className="title-color" level={5}>
            <MintSymbol mintAddress={mintAddress} />
          </Typography.Title>
        </Space>
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
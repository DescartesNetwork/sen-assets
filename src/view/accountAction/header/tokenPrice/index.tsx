import { Col, Divider, Row, Space, Tooltip, Typography } from 'antd'
import { MintAvatar, MintSymbol } from '@sen-use/components'
import Price, { PriceChange, PriceIndicator } from 'components/price'
import IconButton from 'components/iconButton'

export const TokenPrice = ({ mintAddress }: { mintAddress: string }) => {
  return (
    <Row>
      <Col flex="auto">
        <Space>
          <MintAvatar mintAddress={mintAddress} />
          <Typography.Title className="title-color" level={5}>
            <MintSymbol mintAddress={mintAddress} />
          </Typography.Title>
          <Tooltip title={`Mint Address: ${mintAddress}`}>
            <IconButton name="information-circle-outline" />
          </Tooltip>
        </Space>
      </Col>
      <Col>
        <Space size={1} align="end">
          <PriceIndicator mintAddress={mintAddress} colorized />
          <PriceChange mintAddress={mintAddress} colorized />
          <Divider
            type="vertical"
            style={{ padding: 0, borderLeft: '1px solid #BEC4EC' }}
          />
          <Typography.Text className="text-color">
            <Price mintAddress={mintAddress} />
          </Typography.Text>
        </Space>
      </Col>
    </Row>
  )
}

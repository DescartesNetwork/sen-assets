import { Col, Row, Space, Typography } from 'antd'

const Network = ({
  title,
  walletAddress,
}: {
  title: string
  walletAddress: string
}) => {
  return (
    <Space direction="vertical" size={0}>
      <Typography.Title level={5}>{title}</Typography.Title>
      <Typography.Text>{walletAddress}</Typography.Text>
    </Space>
  )
}

const TransferInfo = ({
  title,
  transferAmount,
}: {
  title: string
  transferAmount: string | number
}) => {
  return (
    <Row>
      <Col flex="auto">
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          {title}
        </Typography.Text>
      </Col>
      <Col>
        <Typography.Text>{transferAmount}</Typography.Text>
      </Col>
    </Row>
  )
}

const ConfirmInfo = () => {
  return (
    <Row gutter={[16, 16]} align="middle" style={{ padding: 16 }}>
      <Col flex="auto">
        <Network title="Solana Network" walletAddress="0x31B86...Ac6e2a" />
      </Col>
      <Col>
        <Network title="Solana Network" walletAddress="0x31B86...Ac6e2a" />
      </Col>
      <Col span={24}>
        <TransferInfo
          title="Token charge gas fee"
          transferAmount="0.000005 SOL ~ $0.000542"
        />
        <TransferInfo
          title="Token withdrawal gas fee"
          transferAmount="0.000005 SOL ~ $0.000542"
        />
      </Col>
    </Row>
  )
}

export default ConfirmInfo

import { useSelector } from 'react-redux'

import { Col, Row, Space, Typography } from 'antd'
import NetworkName from 'app/components/network/networkName'

import { AppState } from 'app/model'
import { shortenAddress } from 'shared/util'

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
  const { sourceChain, sourceWalletAddress, targetChain, targetWalletAddress } =
    useSelector((state: AppState) => state.wormhole)
  return (
    <Row gutter={[16, 16]} align="middle" style={{ padding: 16 }}>
      {/* Source Network */}
      <Col flex="auto">
        <Space direction="vertical" size={0}>
          <Typography.Title level={5}>
            <NetworkName chainId={sourceChain} /> Network
          </Typography.Title>
          <Typography.Text>
            {shortenAddress(sourceWalletAddress)}
          </Typography.Text>
        </Space>
      </Col>
      {/* Target Network */}
      <Col>
        <Space direction="vertical" size={0} align="end">
          <Typography.Title level={5}>
            <NetworkName chainId={targetChain} /> Network
          </Typography.Title>
          <Typography.Text>
            {shortenAddress(targetWalletAddress)}
          </Typography.Text>
        </Space>
      </Col>
      {/* Fee info */}
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

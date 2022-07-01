import { useSelector } from 'react-redux'

import { Col, Row, Space, Typography } from 'antd'
import NetworkName from 'components/network/networkName'

import { AppState } from 'model'
import { util } from '@sentre/senhub'

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
            {util.shortenAddress(sourceWalletAddress)}
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
            {util.shortenAddress(targetWalletAddress)}
          </Typography.Text>
        </Space>
      </Col>
    </Row>
  )
}

export default ConfirmInfo

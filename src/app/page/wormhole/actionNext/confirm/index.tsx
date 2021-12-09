import { useSelector } from 'react-redux'

import { Card, Col, Modal, Row, Typography } from 'antd'
import NetworkAvatar from 'app/components/network/networkAvatar'
import ConfirmInfo from './confirmInfo'
import ConfirmAction from './confirmTransfer'

import { AppState } from 'app/model'

const ConfirmBridge = ({
  visible = false,
  onCancel = () => {},
}: {
  visible?: boolean
  onCancel?: (visible: boolean) => void
}) => {
  const { sourceChain, targetChain, amount, sourceTokens, tokenAddress } =
    useSelector((state: AppState) => state.wormhole)
  const sourceToken = sourceTokens[tokenAddress]

  if (!sourceToken) return null
  return (
    <Modal visible={visible} footer={false} closable={false} centered>
      <Row gutter={[16, 16]} justify="center">
        <Col style={{ marginBottom: 50 }}>
          <Typography.Title level={4}>Confirm transfer</Typography.Title>
        </Col>
        <Col span={24}>
          <Card
            bordered={false}
            className="confirm-transfer-wrap"
            bodyStyle={{ padding: 0 }}
          >
            {/* transfer header */}
            <Row className="confirm-transfer-header">
              <Col span={12}>
                <NetworkAvatar chainId={sourceChain} size={32} />
              </Col>
              <Col span={12}>
                <NetworkAvatar chainId={targetChain} size={32} />
              </Col>
              <Col className="amount">
                <Typography.Text style={{ color: '#ffffff' }}>
                  {sourceToken.symbol}
                </Typography.Text>
                <Typography.Title level={3} style={{ color: '#ffffff' }}>
                  {amount}
                </Typography.Title>
              </Col>
            </Row>
            {/* transfer information */}
            <ConfirmInfo />
          </Card>
        </Col>
        {/* button confirm */}
        <Col span={24}>
          <ConfirmAction onClose={onCancel} />
        </Col>
      </Row>
    </Modal>
  )
}

export default ConfirmBridge

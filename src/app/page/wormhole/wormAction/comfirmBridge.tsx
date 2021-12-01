import { Card, Col, Modal, Row, Typography } from 'antd'
import { MintAvatar } from 'app/shared/components/mint'
import ConfirmInfo from './confirmInfo'
import ConfirmAction from './confirmAction'

const ConfirmBridge = ({
  visible = false,
  onCancel = () => {},
}: {
  visible?: boolean
  onCancel?: (visible: boolean) => void
}) => {
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
                <MintAvatar mintAddress={''} size={32} />
              </Col>
              <Col span={12}>
                <MintAvatar mintAddress={''} size={32} />
              </Col>
              <Col className="amount">
                <Typography.Title level={3}>10</Typography.Title>
                <Typography.Text>SOL</Typography.Text>
              </Col>
            </Row>
            {/* transfer infomations */}
            <ConfirmInfo />
          </Card>
        </Col>
        <Col span={24}>
          <ConfirmAction onClose={onCancel} />
        </Col>
      </Row>
    </Modal>
  )
}

export default ConfirmBridge

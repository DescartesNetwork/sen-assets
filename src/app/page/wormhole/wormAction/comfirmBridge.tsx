import { Button, Card, Checkbox, Col, Modal, Row, Typography } from 'antd'
import { MintAvatar } from 'app/shared/components/mint'

const ConfirmBridge = ({
  visible = false,
  onCancel = () => {},
}: {
  visible?: boolean
  onCancel?: (visible: boolean) => void
}) => {
  return (
    <Modal visible={visible} footer={false}>
      <Row gutter={[16, 16]} justify="center">
        <Col style={{ marginBottom: 50 }}>
          <Typography.Title level={4}>Confirm transfer</Typography.Title>
        </Col>
        <Col span={24}>
          <Card bordered={false}>
            <Row className="confirm-transfer-header">
              <Col span={12}>
                <MintAvatar mintAddress={''} size={32} />
              </Col>
              <Col span={12}>
                <MintAvatar mintAddress={''} size={32} />
              </Col>
              <Col span={24}></Col>
            </Row>
          </Card>
        </Col>
        <Col span={24}>
          <Checkbox>I have read and understood</Checkbox>
        </Col>
        <Col span={24}>
          <Button type="primary" block>
            Approve {0} token
          </Button>
        </Col>
        <Col>
          <Button type="text" onClick={() => onCancel(false)}>
            Cancel
          </Button>
        </Col>
      </Row>
    </Modal>
  )
}

export default ConfirmBridge

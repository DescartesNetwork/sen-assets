import { Row, Col, Typography, Input } from 'antd'

const Destination = ({
  onChange,
  value,
}: {
  onChange: (amount: string) => void
  value: string
}) => {
  return (
    <Row gutter={[8, 8]}>
      <Col span={24}>
        <Typography.Text>Receiver Address</Typography.Text>
      </Col>
      <Col span={24}>
        <Input
          size="large"
          placeholder={'Gskkslslssf...'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </Col>
    </Row>
  )
}

export default Destination

import { useWalletAddress } from '@sentre/senhub'
import { Row, Col, Typography, Input } from 'antd'

const Destination = ({
  onChange,
  value,
}: {
  onChange: (amount: string) => void
  value: string
}) => {
  const walletAddress = useWalletAddress()

  // TODO: validate address

  return (
    <Row gutter={[8, 8]}>
      <Col span={24}>
        <Typography.Text>Receiver Address</Typography.Text>
      </Col>
      <Col span={24}>
        <Input
          size="large"
          placeholder={`${walletAddress.substring(0, 12)}...`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </Col>
    </Row>
  )
}

export default Destination

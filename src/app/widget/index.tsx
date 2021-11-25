import { Row, Col, Card } from 'antd'
import MintAvatar from 'app/components/mintAvatar'
import { useAccount } from 'senhub/providers'

const Widget = () => {
  const { accounts } = useAccount()
  return (
    <Row gutter={[12, 12]}>
      {Object.keys(accounts).map((addr) => (
        <Col span={24}>
          <Card bodyStyle={{ padding: '16px 12px' }} bordered={false}>
            <MintAvatar
              mintAddress={accounts[addr].mint}
              size={32}
            ></MintAvatar>
          </Card>
        </Col>
      ))}
    </Row>
  )
}

export default Widget

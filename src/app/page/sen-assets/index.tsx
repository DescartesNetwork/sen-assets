import { Card, Col, Row } from 'antd'
import MintAvatar from '../../components/mintAvatar'
import { useAccount } from 'senhub/providers'

const SenAssets = () => {
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
export default SenAssets

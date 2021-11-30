import { useSelector } from 'react-redux'

import { Col, Row, Space, Typography } from 'antd'
import MintAvatar from 'app/shared/components/mintAvatar'

import { useAccount } from 'senhub/providers'
import { AppState } from 'app/model'

const WormTitle = () => {
  const { accountSelected } = useSelector((state: AppState) => state.account)
  const { accounts } = useAccount()
  const account = accounts[accountSelected] || {}
  const mint = account.mint

  return (
    <Row gutter={[24, 24]}>
      <Col flex="auto">
        <Typography.Title level={4}>
          Wormhole <span style={{ color: '#F9575E' }}>Bridge</span>
        </Typography.Title>
      </Col>
      <Col>
        <Space>
          <Typography.Text style={{ fontSize: 12, color: '#7A7B85' }}>
            Power by
          </Typography.Text>
          <MintAvatar mintAddress={mint} size={16} />
        </Space>
      </Col>
    </Row>
  )
}

export default WormTitle

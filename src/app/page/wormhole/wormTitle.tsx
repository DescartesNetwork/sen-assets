import { useSelector } from 'react-redux'

import { Col, Row, Space, Typography } from 'antd'
import { MintAvatar } from 'app/shared/components/mint'

import { useAccount } from 'senhub/providers'
import { AppState } from 'app/model'
import PowerBy from 'os/components/powerBy'

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
        <PowerBy />
      </Col>
    </Row>
  )
}

export default WormTitle

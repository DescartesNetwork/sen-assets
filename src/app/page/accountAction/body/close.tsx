import { Row, Col, Card, Typography, Button, Space } from 'antd'
import IonIcon from 'shared/antd/ionicon'

import { useAccount } from 'senhub/providers'
import { explorer, shortenAddress } from 'shared/util'
import { selectAccount } from 'app/model/account.controller'
import { DEFAULT_EMPTY_ADDRESS } from '@senswap/sen-js'
import { useDispatch } from 'react-redux'

const Close = ({ accountAddr }: { accountAddr: string }) => {
  const dispatch = useDispatch()
  const { accounts } = useAccount()
  const account = accounts[accountAddr] || {}

  const close = async () => {
    try {
      const { splt, wallet } = window.sentre
      if (!wallet) return
      const { txId } = await splt.closeAccount(accountAddr, wallet)
      await window.notify({
        type: 'success',
        description: `Close ${shortenAddress(
          accountAddr,
        )} successfully. Click to view details.`,
        onClick: () => window.open(explorer(txId), '_blank'),
      })
      dispatch(selectAccount({ account: DEFAULT_EMPTY_ADDRESS }))
    } catch (er) {
      return window.notify({ type: 'error', description: 'error' })
    }
  }

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Card bordered={false} className="close-account">
          <Space>
            <IonIcon name="alert-circle-outline" />
            <Typography.Text>
              Please transfer out all tokens in this account before closing!
            </Typography.Text>
          </Space>
        </Card>
      </Col>

      <Col span={24}>
        <Button
          type="primary"
          onClick={close}
          disabled={Boolean(account.amount)}
          block
        >
          Close Account
        </Button>
      </Col>
    </Row>
  )
}

export default Close

import { useSelector } from 'react-redux'

import { Row, Col, Card, Typography, Button, Space } from 'antd'
import IonIcon from 'shared/ionicon'

import { useAccount } from 'senhub/providers'
import { AppState } from 'app/model'
import { explorer } from 'shared/util'

const Close = ({ accountAddr }: { accountAddr: string }) => {
  const { accountSelected } = useSelector((state: AppState) => state.account)
  const { accounts } = useAccount()
  const account = accounts[accountSelected] || {}

  const close = async () => {
    try {
      const { splt, wallet } = window.sentre
      if (!wallet) return
      const { txId } = await splt.closeAccount(accountSelected, wallet)
      await window.notify({
        type: 'success',
        description: `Close ${accountSelected.substring(0, 6) +
          '...' +
          accountSelected.substring(
            accountSelected.length - 6,
            accountSelected.length,
          )
          } successfully. Click to view details.`,
        onClick: () => window.open(explorer(txId), '_blank'),
      })
    } catch (er) {
      return window.notify({ type: 'error', description: 'error' })
    }
  }

  return (
    <Card bordered={false} className="close-account">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Space>
            <IonIcon name="alert-circle-outline" />
            <Typography.Text>
              Please transfer out all tokens in this account before closing!
                </Typography.Text>
          </Space>
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
    </Card>
  )
}

export default Close

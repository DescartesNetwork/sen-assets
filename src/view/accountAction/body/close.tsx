import { useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { useAccount, useWallet } from '@sentre/senhub'

import { Row, Col, Card, Typography, Button, Space } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

import { util } from '@sentre/senhub'
import { selectAccount } from 'model/account.controller'
import { DEFAULT_EMPTY_ADDRESS } from '@senswap/sen-js'

import { AppDispatch } from 'model'

const Close = ({ accountAddr }: { accountAddr: string }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { accounts } = useAccount()
  const { wallet } = useWallet()
  const account = accounts[accountAddr] || {}

  const close = async () => {
    try {
      const { splt, wallet } = window.sentre
      if (!wallet) return
      const { txId } = await splt.closeAccount(accountAddr, wallet)
      await window.notify({
        type: 'success',
        description: `Close ${util.shortenAddress(
          accountAddr,
        )} successfully. Click to view details.`,
        onClick: () => window.open(util.explorer(txId), '_blank'),
      })
      dispatch(selectAccount({ account: DEFAULT_EMPTY_ADDRESS }))
    } catch (er) {
      return window.notify({ type: 'error', description: 'error' })
    }
  }

  const errorMessage = useMemo(() => {
    if (account.close_authority !== wallet.address)
      return `You don't have permission to close this account!`
    if (!!account.amount)
      return 'Please transfer out all tokens in this account before closing!'
  }, [account.amount, account.close_authority, wallet.address])

  return (
    <Row gutter={[16, 16]}>
      {!!errorMessage && (
        <Col span={24}>
          <Card bordered={false} className="close-account">
            <Space>
              <IonIcon name="alert-circle-outline" />
              <Typography.Text>{errorMessage}</Typography.Text>
            </Space>
          </Card>
        </Col>
      )}
      <Col span={24}>
        <Button
          type="primary"
          onClick={close}
          disabled={Boolean(account.amount)}
          block
          size="large"
        >
          Close Account
        </Button>
      </Col>
    </Row>
  )
}

export default Close

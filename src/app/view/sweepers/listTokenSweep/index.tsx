import { forwardRef, useImperativeHandle, useMemo, useState } from 'react'
import { useAccount } from '@senhub/providers'

import { Col, Row, Space, Typography } from 'antd'
import CardToken from './cardToken'

import SpltHelper from 'app/lib/spltHelper'

type ListTokenSweepProps = {
  setLoadingBtn: (loading: boolean) => void
}

const ListTokenSweep = forwardRef(
  ({ setLoadingBtn }: ListTokenSweepProps, ref) => {
    const { accounts } = useAccount()
    const [accountsSelected, setAccountsSelected] = useState<
      Record<string, boolean>
    >({})

    const totalAccountsSelected = Object.values(accountsSelected).reduce(
      (total, value) => {
        if (value) return total + 1
        return total
      },
      0,
    )

    const listAccounts = useMemo(() => {
      const accountFilter: string[] = []
      for (const accAddr in accounts) {
        const account = accounts[accAddr]
        if (Number(account.amount.toString()) === 0) accountFilter.push(accAddr)
      }
      return accountFilter
    }, [accounts])

    const onChooseAccount = (accountAddress: string, isChecked: boolean) => {
      let accounts = JSON.parse(JSON.stringify(accountsSelected))
      setAccountsSelected(
        Object.assign(accounts, { [accountAddress]: isChecked }),
      )
    }

    useImperativeHandle(ref, () => ({
      sweepAccounts: async () => {
        setLoadingBtn(true)
        try {
          let accounts = Object.keys(accountsSelected).filter(
            (accountAddress) => {
              return accountsSelected[accountAddress] === true
            },
          )
          const spltHelper = new SpltHelper()
          await spltHelper.closeAccounts(accounts)
          setAccountsSelected({})
          window.notify({
            type: 'success',
            description: `Close accounts successfully.`,
          })
        } catch (er: any) {
          window.notify({ type: 'error', description: er.message })
        } finally {
          setLoadingBtn(false)
        }
      },
      onSelectAll: (isSelectAll: boolean) => {
        let accountSelected: Record<string, boolean> = {}
        if (isSelectAll) {
          listAccounts.forEach((accAddr) => {
            accountSelected[accAddr] = true
          })
        }
        setAccountsSelected(accountSelected)
      },
    }))

    return (
      <Space direction="vertical" style={{ width: '100%' }}>
        <Row gutter={[16, 16]} className="scrollbar" style={{ maxHeight: 500 }}>
          {listAccounts.map((address) => (
            <Col span={24} key={address}>
              <CardToken
                accountAddress={address}
                onSelect={onChooseAccount}
                isChecked={accountsSelected[address]}
              />
            </Col>
          ))}
        </Row>
        <Space>
          <Typography.Text type="danger">
            {totalAccountsSelected}
          </Typography.Text>{' '}
          selected
        </Space>
      </Space>
    )
  },
)

export default ListTokenSweep

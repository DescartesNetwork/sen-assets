import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { DEFAULT_EMPTY_ADDRESS, DEFAULT_WSOL } from '@senswap/sen-js'

import { Card, Tabs } from 'antd'
import Transfer from 'app/page/accountAction/body/transfer'
import Receive from 'app/page/accountAction/body/receive'
import Wrapper from 'app/page/accountAction/body/wrapper'
import { useAccount } from 'senhub/providers'

import { AppState } from 'app/model'
import { useWallet } from 'senhub/providers'

const Body = () => {
  const { accountSelected } = useSelector((state: AppState) => state.account)
   const {
    wallet: { address },
   } = useWallet()
   const { accounts } = useAccount()
  const { mint, owner } = accounts[accountSelected] || {}

  const isSolAccount = accountSelected === DEFAULT_EMPTY_ADDRESS
  const transferAddress = useMemo(() => {
    if (isSolAccount) return DEFAULT_EMPTY_ADDRESS
    return accountSelected
  }, [accountSelected, isSolAccount])

  const wrapperAddress = useMemo(() => {
    if (isSolAccount) return DEFAULT_WSOL
    return accountSelected
  }, [accountSelected, isSolAccount])

  return (
    <Card
      bordered={false}
      style={{ marginTop: -20, boxShadow: 'none' }}
      bodyStyle={{
        padding: 16,
        paddingTop: 4 /* TabPane padding-top:12 + 4 = 16 */,
      }}
    >
      <Tabs>
        <Tabs.TabPane tab="Send" key="Send">
          <Transfer accountAddr={transferAddress} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Receive" key="Receive" disabled={isSolAccount}>
          <Receive accountAddr={accountSelected} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Wrapper" key="Wrapper" disabled={!isSolAccount}>
          <Wrapper accountAddr={wrapperAddress} />
        </Tabs.TabPane>
      </Tabs>
    </Card>
  )
}

export default Body

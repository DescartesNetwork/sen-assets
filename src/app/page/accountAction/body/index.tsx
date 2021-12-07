import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { DEFAULT_EMPTY_ADDRESS, DEFAULT_WSOL } from '@senswap/sen-js'

import { Card, Tabs } from 'antd'
import Transfer from 'app/page/accountAction/body/transfer'
import Receive from 'app/page/accountAction/body/receive'
import Wrap from 'app/page/accountAction/body/wrap'
import Close from './close'

import { AppState } from 'app/model'
import { useAccount, useWallet } from 'senhub/providers'

const Body = () => {
  const [activeKey, setActiveKey] = useState('')
  const { accountSelected } = useSelector((state: AppState) => state.account)
  const { wallet: { address: walletAddress } } = useWallet();
  const { accounts } = useAccount()
  const { mint } = accounts[accountSelected] || {}

  const isSolAccount = accountSelected === DEFAULT_EMPTY_ADDRESS
  const isWSolAccount = mint === DEFAULT_WSOL
  const transferAddress = useMemo(() => {
    if (isSolAccount) return DEFAULT_EMPTY_ADDRESS
    return accountSelected
  }, [accountSelected, isSolAccount])

  const wrapAddress = useMemo(() => {
    if (isSolAccount) return DEFAULT_WSOL
    return accountSelected
  }, [accountSelected, isSolAccount])

  const receiveAddress = useMemo(() => {
    if (isSolAccount) return walletAddress
    return accountSelected
  }, [accountSelected, isSolAccount, walletAddress])

  // Select send tab when choose new account
  useEffect(() => {
    return setActiveKey('Send')
  }, [accountSelected])

  return (
    <Card
      bordered={false}
      style={{ marginTop: -20, boxShadow: 'none' }}
      bodyStyle={{
        padding: 16,
        paddingTop: 4 /* TabPane padding-top:12 + 4 = 16 */,
      }}
    >
      <Tabs activeKey={activeKey} onChange={setActiveKey}>
        <Tabs.TabPane tab="Send" key="Send">
          <Transfer accountAddr={transferAddress} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Receive" key="Receive">
          <Receive accountAddr={receiveAddress} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Wrap" key="Wrap" disabled={!isSolAccount && !isWSolAccount}>
          <Wrap accountAddr={wrapAddress} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Close" key="Close" disabled={isSolAccount}>
          <Close accountAddr={accountSelected} />
        </Tabs.TabPane>
      </Tabs>
    </Card>
  )
}

export default Body

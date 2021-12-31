import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { Card, Tabs } from 'antd'
import Transfer from 'app/page/accountAction/body/transfer'
import Receive from 'app/page/accountAction/body/receive'
import Wrap from 'app/page/accountAction/body/wrap'
import Close from './close'

import { AppState } from 'app/model'
import { useMintAccount } from 'app/hooks/useMintAccount'
import { SOL_ADDRESS, WSOL_ADDRESS } from 'app/constant/sol'

const Body = () => {
  const [activeKey, setActiveKey] = useState('')
  const { accountSelected } = useSelector((state: AppState) => state.account)
  const { mint } = useMintAccount(accountSelected)

  const canWrap = [SOL_ADDRESS, WSOL_ADDRESS].includes(mint)

  useEffect(() => {
    return setActiveKey('Send')
  }, [accountSelected])

  return (
    <Card
      bordered={false}
      style={{ marginTop: -20, boxShadow: 'none' }}
      bodyStyle={{ padding: 0 }}
    >
      <Tabs
        activeKey={activeKey}
        onChange={setActiveKey}
        style={{ padding: 16, paddingTop: 4 }}
      >
        <Tabs.TabPane tab="Send" key="Send">
          <Transfer accountAddr={accountSelected} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Receive" key="Receive">
          <Receive accountAddr={accountSelected} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Wrap/Unwrap" key="Wrap/Unwrap" disabled={!canWrap}>
          <Wrap />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Close" key="Close" disabled={mint === SOL_ADDRESS}>
          <Close accountAddr={accountSelected} />
        </Tabs.TabPane>
      </Tabs>
    </Card>
  )
}

export default Body

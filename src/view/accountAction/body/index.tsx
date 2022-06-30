import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { Card, Tabs } from 'antd'
import Transfer from 'view/accountAction/body/transfer'
import Receive from 'view/accountAction/body/receive'
import Wrap from 'view/accountAction/body/wrap'
import Close from './close'

import { AppState } from 'model'
import { useMintAccount } from 'hooks/useMintAccount'
import { SOL_ADDRESS, WSOL_ADDRESS } from 'constant/sol'

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
      style={{ boxShadow: 'none' }}
      bodyStyle={{ padding: 0 }}
    >
      <Tabs activeKey={activeKey} onChange={setActiveKey}>
        <Tabs.TabPane tab="Send" key="Send">
          <Transfer accountAddr={accountSelected} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Wrap/Unwrap" key="Wrap/Unwrap" disabled={!canWrap}>
          <Wrap />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Receive" key="Receive">
          <Receive accountAddr={accountSelected} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Close" key="Close" disabled={mint === SOL_ADDRESS}>
          <Close accountAddr={accountSelected} />
        </Tabs.TabPane>
      </Tabs>
    </Card>
  )
}

export default Body

import { useSelector } from 'react-redux'

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
          <Transfer accountAddr={accountSelected} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Receive" key="Receive">
          <Receive accountAddr={address} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Wrap" key="Wrap" disabled={mint !== owner}>
          <Wrapper accountAddr={accountSelected} />
        </Tabs.TabPane>
      </Tabs>
    </Card>
  )
}

export default Body

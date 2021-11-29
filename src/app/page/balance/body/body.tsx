import { Card, Tabs } from 'antd'
import Transfer from 'app/components/transfer'
import QRCode from 'qrcode.react'
import { AppState } from 'app/model'
import { useSelector } from 'react-redux'
import { useWallet } from 'senhub/providers'
import Receive from 'app/components/receive/receive'
import Wrapper from 'app/components/wrapper/wrapper'

const Body = () => {
  const { wallet } = useWallet()
  const { accountSelected } = useSelector((state: AppState) => state.account)

  return (
    <Card
      bordered={false}
      style={{ marginTop: -20, boxShadow: 'none' }}
      bodyStyle={{ padding: 16, paddingTop: 0 }}
    >
      <Tabs>
        <Tabs.TabPane tab="Send" key="Send">
          <Transfer accountAddr={accountSelected} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Receive" key="Receive">
         <Receive/>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Wrapper" key="Wrapper">
          <Wrapper accountAddr={accountSelected}/>
        </Tabs.TabPane>
      </Tabs>
    </Card>
  )
}

export default Body

import { useSelector } from 'react-redux'

import { Card, Tabs } from 'antd'
import Transfer from 'app/components/transfer'
import Receive from 'app/components/receive/receive'
import Wrapper from 'app/components/wrapper/wrapper'

import { AppState } from 'app/model'

const Body = () => {
  const { accountSelected } = useSelector((state: AppState) => state.account)

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
          <Receive accountAddr={accountSelected} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Wrapper" key="Wrapper">
          <Wrapper accountAddr={accountSelected} />
        </Tabs.TabPane>
      </Tabs>
    </Card>
  )
}

export default Body

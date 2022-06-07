import { useEffect } from 'react'
import { forceCheck } from '@sentre/react-lazyload'

import { Row, Col } from 'antd'
import SenAssets from './walletAccounts'
import AccountAction from './accountAction'
import WormHole from './wormhole'
import History from './history'

let timeOutForceCheck: NodeJS.Timeout

const View = () => {
  useEffect(() => {
    window.onscroll = () => {
      if (timeOutForceCheck) clearTimeout(timeOutForceCheck)
      timeOutForceCheck = setTimeout(forceCheck, 500)
    }
  }, [])

  return (
    <Row gutter={[24, 24]} style={{ paddingBottom: 12 }}>
      <Col xl={8} md={12} sm={24}>
        <SenAssets />
      </Col>
      <Col xl={8} md={12} sm={24}>
        <AccountAction />
      </Col>
      <Col xl={8} md={12} sm={24}>
        <WormHole />
      </Col>
      <Col span={24}>
        <History />
      </Col>
    </Row>
  )
}

export default View

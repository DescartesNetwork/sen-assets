import { useEffect } from 'react'
import { forceCheck } from '@sentre/react-lazyload'

import { Row, Col } from 'antd'
import SenAssets from './walletAccounts'
import WormHole from './wormhole'

let timeOutForceCheck: NodeJS.Timeout

const View = () => {
  useEffect(() => {
    window.onscroll = () => {
      if (timeOutForceCheck) clearTimeout(timeOutForceCheck)
      timeOutForceCheck = setTimeout(forceCheck, 500)
    }
  }, [])

  return (
    <Row gutter={[24, 24]} style={{ paddingBottom: 12 }} justify="center">
      <Col span={24}>
        <SenAssets />
      </Col>
      <Col span={24}>
        <WormHole />
      </Col>
    </Row>
  )
}

export default View

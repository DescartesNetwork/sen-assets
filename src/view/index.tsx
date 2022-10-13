import { useEffect } from 'react'
import { forceCheck } from '@sentre/react-lazyload'
import { Redirect, Route, Switch } from 'react-router-dom'

import { Col, Layout, Row } from 'antd'

import configs from 'configs'
import DetailsNFT from './NFTs/detailsNFT'
import Dashboard from './dashboard'

let timeOutForceCheck: NodeJS.Timeout

const {
  manifest: { appId },
} = configs

const View = () => {
  useEffect(() => {
    window.onscroll = () => {
      if (timeOutForceCheck) clearTimeout(timeOutForceCheck)
      timeOutForceCheck = setTimeout(forceCheck, 500)
    }
  }, [])

  return (
    <Layout>
      <Row gutter={[24, 24]}>
        <Col
          span={24}
          style={{
            paddingLeft: 0,
            paddingRight: 0,
          }}
        >
          <Switch>
            <Route
              exact
              path={`/app/${appId}/dashboard`}
              component={Dashboard}
            />
            <Route
              exact
              path={`/app/${appId}/dashboard/:mintNFT`}
              component={DetailsNFT}
            />
            <Redirect from="*" to={`/app/${appId}/dashboard`} />
          </Switch>
        </Col>
      </Row>
    </Layout>
  )
}

export default View

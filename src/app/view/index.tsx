import { useEffect, useState } from 'react'
import { forceCheck } from '@sentre/react-lazyload'
import { Redirect, Route, Switch } from 'react-router-dom'
import { useUI } from '@senhub/providers'

import { Avatar, Drawer } from 'antd'
import { Layout } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

import WormHole from './wormhole'
import SideBar from './sideBar'
import NFTs from './NFTs/index'
import Tokens from './tokens'
import configs from 'app/configs'
import DetailsNFT from './NFTs/detailsNFT'

let timeOutForceCheck: NodeJS.Timeout

const { Content, Sider } = Layout

const {
  manifest: { appId },
} = configs

const View = () => {
  const {
    ui: { width, theme },
  } = useUI()
  const isMobile = width < 992
  const [isToggled, setToggled] = useState(false)

  const onToggle = () => setToggled(!isToggled)
  const onClose = () => {
    setToggled(false)
  }

  useEffect(() => {
    window.onscroll = () => {
      if (timeOutForceCheck) clearTimeout(timeOutForceCheck)
      timeOutForceCheck = setTimeout(forceCheck, 500)
    }
  }, [])

  return (
    <Layout style={{ height: '88vh', paddingBottom: '10px' }}>
      {isMobile ? (
        <Drawer
          placement="right"
          onClose={onClose}
          closable={true}
          visible={isToggled}
          width={338}
          bodyStyle={{ padding: 0 }}
        >
          <SideBar />
        </Drawer>
      ) : (
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          collapsed={isToggled}
          onBreakpoint={(broken) => {
            setToggled(broken)
          }}
          width={338}
          theme={theme}
          trigger={null}
          className="sidebar"
          style={{ background: 'unset' }}
        >
          <SideBar />
        </Sider>
      )}

      <Layout className="site-layout">
        <Content style={{ overflow: 'initial' }}>
          <Switch>
            <Route
              exact
              path={`/app/${appId}/token-asset`}
              component={Tokens}
            />
            <Route exact path={`/app/${appId}/nft-asset`} component={NFTs} />
            <Route
              exact
              path={`/app/${appId}/portal-bridge`}
              component={WormHole}
            />
            <Route
              exact
              path={`/app/${appId}/nft-asset/:mintNFT`}
              component={DetailsNFT}
            />
            <Redirect from="*" to={`/app/${appId}/token-asset`} />
          </Switch>
        </Content>
      </Layout>

      {isMobile && (
        <div className="fixed-widgets">
          <div onClick={onToggle}>
            <Avatar icon={<IonIcon name="list-outline" />} />
          </div>
        </div>
      )}
    </Layout>
  )
}

export default View

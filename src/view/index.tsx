import { useEffect, useState } from 'react'
import { forceCheck } from '@sentre/react-lazyload'
import { Redirect, Route, Switch } from 'react-router-dom'
import { useWidth } from '@sentre/senhub'

import { Avatar } from 'antd'
import { Layout } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

import configs from 'configs'
import DetailsNFT from './NFTs/detailsNFT'
import Dashboard from './dashboard'

let timeOutForceCheck: NodeJS.Timeout

const { Content } = Layout

const {
  manifest: { appId },
} = configs

const View = () => {
  const width = useWidth()
  const isMobile = width < 992
  const [isToggled, setToggled] = useState(false)

  const onToggle = () => setToggled(!isToggled)

  useEffect(() => {
    window.onscroll = () => {
      if (timeOutForceCheck) clearTimeout(timeOutForceCheck)
      timeOutForceCheck = setTimeout(forceCheck, 500)
    }
  }, [])

  return (
    <Layout>
      <Content>
        <Switch>
          <Route exact path={`/app/${appId}/dashboard`} component={Dashboard} />
          <Route
            exact
            path={`/app/${appId}/dashboard/:mintNFT`}
            component={DetailsNFT}
          />
          <Redirect from="*" to={`/app/${appId}/dashboard`} />
        </Switch>
      </Content>
      {isMobile && !isToggled && (
        <Content>
          <div className="fixed-widgets">
            <div onClick={onToggle}>
              <Avatar
                className="fixed-widgets-icon"
                shape="circle"
                style={{ backgroundColor: '#f9575e' }}
                icon={
                  <IonIcon name="list-outline" style={{ color: 'white' }} />
                }
              />
            </div>
          </div>
        </Content>
      )}
    </Layout>
  )
}

export default View

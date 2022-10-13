import { Provider } from 'react-redux'
import { AntdProvider } from '@sentre/senhub'

import View from 'view'
import { WormHoleFrame } from 'view/wormhole'

import model from 'model'
import configs from 'configs'

import 'static/styles/dark.less'
import 'static/styles/light.less'

const {
  manifest: { appId },
} = configs

export const FrameWormhole = () => {
  return (
    <AntdProvider appId={appId} prefixCls={appId}>
      <Provider store={model}>
        <WormHoleFrame />
      </Provider>
    </AntdProvider>
  )
}

export const Page = () => {
  return (
    <AntdProvider appId={appId} prefixCls={appId}>
      <Provider store={model}>
        <View />
      </Provider>
    </AntdProvider>
  )
}

export * from 'static.app'

import { Provider } from 'react-redux'
import {
  WalletProvider,
  UIProvider,
  PoolProvider,
  MintProvider,
  AccountProvider,
} from '@sentre/senhub'

import View from 'view'

import model from 'model'
import configs from 'configs'

import 'static/styles/dark.less'
import 'static/styles/light.less'

const {
  manifest: { appId },
} = configs

export const Page = () => {
  return (
    <UIProvider appId={appId} antd={{ prefixCls: appId }}>
      <WalletProvider>
        <PoolProvider>
          <MintProvider>
            <AccountProvider>
              <Provider store={model}>
                <View />
              </Provider>
            </AccountProvider>
          </MintProvider>
        </PoolProvider>
      </WalletProvider>
    </UIProvider>
  )
}

export * from 'static.app'

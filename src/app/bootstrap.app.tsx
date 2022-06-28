import { Provider } from 'react-redux'
import {
  WalletProvider,
  UIProvider,
  PoolProvider,
  MintProvider,
  AccountProvider,
} from '@senhub/providers'

import View from 'app/view'

import model from 'app/model'
import configs from 'app/configs'

import 'app/static/styles/dark.less'
import 'app/static/styles/light.less'

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

export * from 'app/static.app'

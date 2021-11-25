import { Provider } from 'react-redux'
import {
  UIProvider,
  WalletProvider,
  PoolProvider,
  MintProvider,
  AccountProvider,
} from 'senhub/providers'

import WidgetView from 'app/widget'

import model from 'app/model'
import configs from 'app/configs'

const {
  manifest: { appId },
} = configs

export const widgetConfig: WidgetConfig = {
  size: 'small',
  type: 'solid',
}

const Widget = () => {
  return (
    <UIProvider appId={appId}>
      <WalletProvider>
        <PoolProvider>
          <MintProvider>
            <AccountProvider>
              <Provider store={model}>
                <WidgetView />
              </Provider>
            </AccountProvider>
          </MintProvider>
        </PoolProvider>
      </WalletProvider>
    </UIProvider>
  )
}

export default Widget

import { Provider } from 'react-redux'
import {
  WalletProvider,
  UIProvider,
  PoolProvider,
  MintProvider,
  AccountProvider,
} from 'senhub/providers'

import PageView from 'app/page'

import model from 'app/model'
import configs from 'app/configs'

const {
  manifest: { appId },
} = configs

const Page = () => {
  return (
    <UIProvider appId={appId}>
      <WalletProvider>
        <PoolProvider>
          <MintProvider>
            <AccountProvider>
              <Provider store={model}>
                <PageView />
              </Provider>
            </AccountProvider>
          </MintProvider>
        </PoolProvider>
      </WalletProvider>
    </UIProvider>
  )
}

export default Page

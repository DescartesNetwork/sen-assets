import Icon from '@ant-design/icons'

import { ReactComponent as TokenAssets } from 'app/static/images/aside/token-assets.svg'
import { ReactComponent as NFTsAssets } from 'app/static/images/aside/nft-assets.svg'
import { ReactComponent as PortalBridge } from 'app/static/images/aside/portal-bridge.svg'

import configs from 'app/configs'

const {
  manifest: { appId },
} = configs
const appPath = '/app/' + appId

export const MENU_LIST = [
  {
    key: appPath + '/tokens-asset',
    label: 'Tokens Asset',
    icon: <Icon component={TokenAssets} style={{ fontSize: '24px' }} />,
  },
  {
    key: appPath + '/nfts-asset',
    label: 'NFTs Asset',
    icon: <Icon component={NFTsAssets} style={{ fontSize: '24px' }} />,
  },
  {
    key: appPath + '/portal-bridge',
    label: 'Portal Bridge',
    icon: <Icon component={PortalBridge} style={{ fontSize: '24px' }} />,
  },
]

import Icon from '@ant-design/icons'
import Tokens from 'view/tokens'
import NFTs from 'view/NFTs'
import WormHole from 'view/wormhole'
import Sweepers from 'view/sweepers'

import { TabAssets } from 'constant/dashboard'
import { ReactComponent as TokenAssets } from 'static/images/aside/token-assets.svg'
import { ReactComponent as NFTsAssets } from 'static/images/aside/nft-assets.svg'
import { ReactComponent as PortalBridge } from 'static/images/aside/portal-bridge.svg'

export const MENU_LIST = [
  {
    key: TabAssets.TokenAssets,
    label: 'Token Assets',
    icon: <Icon component={TokenAssets} style={{ fontSize: '24px' }} />,
    children: <Tokens />,
  },
  {
    key: TabAssets.NFTAssets,
    label: 'NFT Assets',
    icon: <Icon component={NFTsAssets} style={{ fontSize: '24px' }} />,
    children: <NFTs />,
  },
  {
    key: TabAssets.PortalBridge,
    label: 'Portal Bridge',
    icon: <Icon component={PortalBridge} style={{ fontSize: '24px' }} />,
    children: <WormHole />,
  },
  {
    key: TabAssets.Sweepers,
    label: 'Sweepers',
    icon: <Icon component={PortalBridge} style={{ fontSize: '24px' }} />,
    children: <Sweepers />,
  },
]

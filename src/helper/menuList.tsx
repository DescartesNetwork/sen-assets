import Icon from '@ant-design/icons'
import Tokens from 'view/tokens'
import NFTs from 'view/NFTs'
import WormHole from 'view/wormhole'
import Sweepers from 'view/sweepers'

import { TabAssets } from 'constant/dashboard'
import { Space } from 'antd'
import IconSax from '@sentre/antd-iconsax'
import { ReactComponent as PortalBridge } from 'static/images/aside/portal-bridge.svg'

export const MENU_LIST = [
  {
    key: TabAssets.TokenAssets,
    label: (
      <Space size={4}>
        <IconSax name="WalletMoney" style={{ fontSize: 24 }} />
        <span className="menu-typography">Token Assets</span>
      </Space>
    ),
    children: <Tokens />,
  },
  {
    key: TabAssets.NFTAssets,
    label: (
      <Space size={4}>
        <IconSax name="ColorsSquare" style={{ fontSize: 24 }} />
        <span className="menu-typography">NFT Assets</span>
      </Space>
    ),
    children: <NFTs />,
  },
  {
    key: TabAssets.PortalBridge,
    label: (
      <Space size={4}>
        <Icon component={PortalBridge} style={{ fontSize: 24 }} />
        <span className="menu-typography">Portal Bridge</span>
      </Space>
    ),
    children: <WormHole />,
  },
  {
    key: TabAssets.Sweepers,
    label: (
      <Space size={4}>
        <IconSax name="Broom" style={{ fontSize: 24 }} />
        <span className="menu-typography">Sweepers</span>
      </Space>
    ),
    children: <Sweepers />,
  },
]

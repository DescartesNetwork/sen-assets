import configs from 'app/configs'
import IonIcon from '@sentre/antd-ionicon'

const {
  manifest: { appId },
} = configs
const appPath = '/app/' + appId

export const MENU_LIST = [
  {
    key: appPath + '/token-asset',
    label: 'Tokens Asset',
    icon: <IonIcon name="wallet-outline" style={{ fontSize: '18px' }} />,
  },
  {
    key: appPath + '/nft-asset',
    label: 'NFTs Asset',
    icon: <IonIcon name="pricetag-outline" style={{ fontSize: '18px' }} />,
  },
  {
    key: appPath + '/portal-bridge',
    label: 'Portal Bridge',
    icon: <IonIcon name="link-outline" style={{ fontSize: '18px' }} />,
  },
]

import configs from 'app/configs'

const {
  manifest: { appId },
} = configs
const appPath = '/app/' + appId

export const menuList = [
  {
    path: appPath + '/token-asset',
    name: 'Tokens Asset',
    icon: 'pricetag-outline',
  },
  {
    path: appPath + '/nft-asset',
    name: 'NFTs Asset',
    icon: 'pricetag-outline',
  },
  {
    path: appPath + '/portal-bridge',
    name: 'Portal Bridge',
    icon: 'link-outline',
  },
]

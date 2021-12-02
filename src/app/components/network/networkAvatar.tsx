import { Avatar } from 'antd'

import { ChainId } from '@certusone/wormhole-sdk'
import { WORMHOLE_NETWORK } from 'app/lib/wormhole/config/wormhole'

const NetworkAvatar = ({
  chainId,
  size = 24,
}: {
  chainId: ChainId
  size?: number
}) => {
  const networkConfig = WORMHOLE_NETWORK.find(
    (config) => config.chainID === chainId,
  )
  return (
    <Avatar
      src={networkConfig?.logo}
      size={size}
      style={{ border: 'none' }}
    ></Avatar>
  )
}

export default NetworkAvatar

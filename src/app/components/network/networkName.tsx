import { ChainId } from '@certusone/wormhole-sdk'

import { WORMHOLE_NETWORK } from 'app/lib/wormhole/config/wormhole'

const NetworkName = ({ chainId }: { chainId: ChainId }) => {
  const networkConfig = WORMHOLE_NETWORK.find(
    (config) => config.chainID === chainId,
  )
  return <span>{networkConfig?.name}</span>
}

export default NetworkName

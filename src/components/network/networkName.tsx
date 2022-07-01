import { ChainId } from '@certusone/wormhole-sdk'

import { WORMHOLE_NETWORK } from 'lib/wormhole/constant/wormhole'

const NetworkName = ({ chainId }: { chainId: ChainId }) => {
  const networkConfig = WORMHOLE_NETWORK.find(
    (config) => config.chainID === chainId,
  )
  return <span>{networkConfig?.name}</span>
}

export default NetworkName

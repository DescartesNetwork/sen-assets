import { ChainId } from '@certusone/wormhole-sdk'
import { AppState } from 'app/model'
import {
  connectSourceWallet,
  disconnectSourceWallet,
  setSourceChain,
} from 'app/model/wormhole.controller'
import { useDispatch, useSelector } from 'react-redux'
import Network from './network'

const SourceWallet = () => {
  const dispatch = useDispatch()

  const { sourceWalletAddress, sourceChain } = useSelector(
    (state: AppState) => state.wormhole,
  )
  const onChange = (chainId: ChainId) => dispatch(setSourceChain({ chainId }))

  const onConnect = () => {
    dispatch(connectSourceWallet())
  }

  const onDisconnect = () => {
    dispatch(disconnectSourceWallet())
  }

  return (
    <Network
      address={sourceWalletAddress}
      chainId={sourceChain}
      onChange={onChange}
      onConnect={onConnect}
      onDisconnect={onDisconnect}
    />
  )
}

export default SourceWallet

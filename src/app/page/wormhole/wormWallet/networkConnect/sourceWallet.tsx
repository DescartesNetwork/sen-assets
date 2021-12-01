import MetamaskWallet from 'app/lib/etherWallet/metamask'
import { AppState } from 'app/model'
import {
  connectSourceWallet,
  disconnectSourceWallet,
} from 'app/model/wormhole.controller'
import { useDispatch, useSelector } from 'react-redux'
import Network from './network'

const SourceWallet = () => {
  const dispatch = useDispatch()
  const { sourceWalletAddress, sourceChain } = useSelector(
    (state: AppState) => state.wormhole,
  )

  const reconnect = () => {
    return new MetamaskWallet()
  }

  const onConnect = () => {
    const wallet = reconnect()
    dispatch(connectSourceWallet({ wallet }))
  }

  const onDisconnect = () => {
    dispatch(disconnectSourceWallet())
  }

  return (
    <Network
      address={sourceWalletAddress}
      chainId={sourceChain}
      onConnect={onConnect}
      onDisconnect={onDisconnect}
    />
  )
}

export default SourceWallet

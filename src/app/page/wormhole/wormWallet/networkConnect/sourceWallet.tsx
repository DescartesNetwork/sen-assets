import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Col, Row } from 'antd'
import Network, { NetworkConnect } from './network'

import MetamaskWallet from 'app/lib/etherWallet/metamask'
import { AppState } from 'app/model'
import {
  connectSourceWallet,
  disconnectSourceWallet,
} from 'app/model/wormhole.controller'

const SourceWallet = () => {
  const dispatch = useDispatch()
  const { sourceWalletAddress, sourceChain } = useSelector(
    (state: AppState) => state.wormhole,
  )
  const [hasProvider, setHasProvider] = useState(false)

  const reconnect = () => {
    return new MetamaskWallet()
  }

  const onConnect = useCallback(async () => {
    const wallet = reconnect()
    const isInstall = await wallet.detectedProvider()
    if (!isInstall) return setHasProvider(false)
    setHasProvider(true)
    dispatch(connectSourceWallet({ wallet }))
  }, [dispatch])

  const onDisconnect = () => {
    dispatch(disconnectSourceWallet())
  }

  useEffect(() => {
    onConnect()
  }, [onConnect])

  return (
    <Row gutter={[16, 16]}>
      <Col flex="auto">
        <Network address={sourceWalletAddress} chainId={sourceChain} />
      </Col>
      <Col>
        <NetworkConnect
          connected={!!sourceWalletAddress}
          installed={hasProvider}
          onConnect={onConnect}
          onDisconnect={onDisconnect}
        />
      </Col>
    </Row>
  )
}

export default SourceWallet

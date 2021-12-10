import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CHAIN_ID_ETH } from '@certusone/wormhole-sdk'
import detectEthereumProvider from '@metamask/detect-provider'

import { Col, Row } from 'antd'
import Network, { NetworkConnect } from './network'

import MetamaskWallet from 'app/lib/etherWallet/metamask'
import { AppState } from 'app/model'
import {
  connectSourceWallet,
  disconnectSourceWallet,
} from 'app/model/wormhole.controller'
import session from 'shared/session'
import { WOH_WALLET } from 'app/lib/wormhole/constant/wormhole'

const SourceWallet = () => {
  const dispatch = useDispatch()
  const { sourceWalletAddress, sourceChain } = useSelector(
    (state: AppState) => state.wormhole,
  )
  const [hasProvider, setHasProvider] = useState(false)

  const getSourceWallet = useCallback(() => {
    const walletType = session.get(WOH_WALLET)
    if (walletType === MetamaskWallet.walletType) return new MetamaskWallet()
    throw new Error('Login wallet fist')
  }, [])

  // check provider
  const checkProvider = useCallback(async () => {
    if (sourceChain === CHAIN_ID_ETH) {
      const detectedProvider = await detectEthereumProvider()
      setHasProvider(!!detectedProvider)
    }
  }, [sourceChain])

  useEffect(() => {
    checkProvider()
  }, [checkProvider])

  // connect source wallet
  const onConnect = useCallback(async () => {
    const wallet = new MetamaskWallet()
    try {
      dispatch(connectSourceWallet({ wallet }))
      wallet.connect()
    } catch (error) {
      wallet.disconnect()
    }
  }, [dispatch])

  const onDisconnect = () => {
    const wallet = getSourceWallet()
    dispatch(disconnectSourceWallet())
    wallet.disconnect()
  }

  // reconnect source wallet
  useEffect(() => {
    const walletType = session.get(WOH_WALLET)
    if (!hasProvider || !walletType) return
    const wallet = getSourceWallet()
    try {
      if (wallet) dispatch(connectSourceWallet({ wallet }))
    } catch (er: any) {
      return window.notify({ type: 'error', description: er.message })
    }
  }, [dispatch, getSourceWallet, hasProvider])

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

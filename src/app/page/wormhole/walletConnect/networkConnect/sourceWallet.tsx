import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ChainId, CHAIN_ID_ETH, CHAIN_ID_SOLANA } from '@certusone/wormhole-sdk'
import detectEthereumProvider from '@metamask/detect-provider'

import { Col, Row } from 'antd'
import Network, { NetworkConnect } from './network'

import MetamaskWallet from 'app/lib/etherWallet/metamask'
import Coin98Wallet from 'app/lib/etherWallet/coin98'
import { AppDispatch, AppState } from 'app/model'
import {
  connectSourceWallet,
  disconnectSourceWallet,
  setSourceToken,
} from 'app/model/wormhole.controller'
import session from 'shared/session'
import { WOH_WALLET } from 'app/lib/wormhole/constant/wormhole'
import { notifyError } from 'app/helper'
import { WalletInterface } from '@senswap/sen-js'
import { IEtherWallet } from 'app/lib/etherWallet/walletInterface'

const SourceWallet = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    wormhole: { sourceWalletAddress, sourceChain },
  } = useSelector((state: AppState) => state)
  const [hasProvider, setHasProvider] = useState(false)
  const [currentSourceAddress, setCurrentSourceAddress] =
    useState(sourceWalletAddress)
  const [currentSourceChain, setCurrentSourceChain] = useState(sourceChain)
  const [disableSelect, setDisableSelect] = useState(false)

  const getSourceWallet = useCallback((fallback: string = '') => {
    const walletType = session.get(WOH_WALLET) || fallback
    if (walletType === MetamaskWallet.walletType) return new MetamaskWallet()
    if (walletType === Coin98Wallet.walletType) return new Coin98Wallet()
    throw new Error(
      'The application now supports Metamask, and Coin98 Wallet only.',
    )
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

  useEffect(() => {
    setDisableSelect(false)
    if (sourceWalletAddress) {
      setDisableSelect(true)
    }
  }, [sourceWalletAddress])

  // connect source wallet
  const onConnect = useCallback(
    async (type: string = '') => {
      let wallet: any = window.sentre.wallet
      if (currentSourceChain !== CHAIN_ID_SOLANA) {
        wallet = getSourceWallet(type)
      }
      try {
        await dispatch(
          connectSourceWallet({ wallet, currentSourceChain }),
        ).unwrap()
        if (currentSourceChain !== CHAIN_ID_SOLANA) {
          return wallet?.connect()
        }
      } catch (er) {
        notifyError(er)
        return wallet.disconnect()
      }
    },
    [currentSourceChain, dispatch, getSourceWallet],
  )

  const onDisconnect = useCallback(async () => {
    try {
      const wallet = getSourceWallet()
      await dispatch(disconnectSourceWallet())
      return wallet.disconnect()
    } catch (er) {
      return notifyError(er)
    }
  }, [getSourceWallet, dispatch])

  const onChooseWallet = (value: ChainId) => {
    console.log(value, 'sksksk')
    setCurrentSourceChain(value)
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

  useEffect(() => {
    setCurrentSourceAddress(sourceWalletAddress)
    setCurrentSourceChain(sourceChain)
  }, [sourceChain, sourceWalletAddress])

  return (
    <Row gutter={[16, 16]}>
      <Col flex="auto">
        <Network
          address={currentSourceAddress}
          chainId={currentSourceChain}
          onChange={onChooseWallet}
          disabled={disableSelect}
        />
      </Col>
      <Col>
        <NetworkConnect
          chainId={currentSourceChain}
          connected={!!sourceWalletAddress}
          onConnect={onConnect}
          onDisconnect={onDisconnect}
        />
      </Col>
    </Row>
  )
}

export default SourceWallet

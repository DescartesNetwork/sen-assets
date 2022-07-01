import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ChainId, CHAIN_ID_ETH, CHAIN_ID_SOLANA } from '@certusone/wormhole-sdk'
import detectEthereumProvider from '@metamask/detect-provider'

import { Col, Row, Tag } from 'antd'
import Network, { NetworkConnect } from './network'

import { AppDispatch, AppState } from 'model'
import {
  changeSourceAndTargetChain,
  connectTargetWallet,
  disconnectTargetWallet,
} from 'model/wormhole.controller'
import { session } from '@sentre/senhub'
import { WOH_WALLET } from 'lib/wormhole/constant/wormhole'
import MetamaskWallet from 'lib/etherWallet/metamask'
import Coin98Wallet from 'lib/etherWallet/coin98'
import { notifyError } from 'helper'

const TargetWallet = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    wormhole: { targetWalletAddress, targetChain },
  } = useSelector((state: AppState) => state)
  const [hasProvider, setHasProvider] = useState(false)

  const getTargetEtherWallet = useCallback((fallback: string = '') => {
    const walletType = session.get(WOH_WALLET) || fallback
    if (walletType === MetamaskWallet.walletType) return new MetamaskWallet()
    if (walletType === Coin98Wallet.walletType) return new Coin98Wallet()
    throw new Error(
      'The application now supports Metamask, and Coin98 Wallet only.',
    )
  }, [])

  // check provider
  const checkProvider = useCallback(async () => {
    if (targetChain === CHAIN_ID_ETH) {
      const detectedProvider = await detectEthereumProvider()
      setHasProvider(!!detectedProvider)
    }
  }, [targetChain])

  useEffect(() => {
    checkProvider()
  }, [checkProvider])

  const onConnect = useCallback(
    async (type: string = '') => {
      const targetWallet = getTargetEtherWallet(type)
      try {
        await dispatch(
          connectTargetWallet({
            wallet: targetWallet,
            targetChain: CHAIN_ID_ETH,
          }),
        )
        return targetWallet.connect()
      } catch (er) {
        notifyError(er)
      }
    },
    [dispatch, getTargetEtherWallet],
  )

  const onDisconnect = useCallback(async () => {
    try {
      const wallet = getTargetEtherWallet()
      await dispatch(disconnectTargetWallet())
      return wallet.disconnect()
    } catch (er) {
      return notifyError(er)
    }
  }, [dispatch, getTargetEtherWallet])

  const onChooseWallet = async (value: ChainId) => {
    let sourceChain: ChainId = CHAIN_ID_SOLANA
    if (value === CHAIN_ID_SOLANA) {
      sourceChain = CHAIN_ID_ETH
      try {
        await dispatch(
          connectTargetWallet({
            wallet: window.sentre.wallet,
            targetChain: value,
          }),
        ).unwrap()
      } catch (er) {
        notifyError(er)
      }
    }

    await dispatch(
      changeSourceAndTargetChain({ sourceChain, targetChain: value }),
    )
  }

  const autoConnectSolWallet = useCallback(async () => {
    try {
      await dispatch(
        connectTargetWallet({
          wallet: window.sentre.wallet,
          targetChain: CHAIN_ID_SOLANA,
        }),
      ).unwrap()
    } catch (er) {
      return notifyError(er)
    }
  }, [dispatch])

  const autoConnectEtherWallet = useCallback(async () => {
    const walletType = session.get(WOH_WALLET)
    if (!hasProvider || !walletType)
      return await dispatch(disconnectTargetWallet())
    const wallet = getTargetEtherWallet()
    try {
      if (wallet)
        dispatch(
          connectTargetWallet({
            wallet,
            targetChain: CHAIN_ID_ETH,
          }),
        )
    } catch (er: any) {
      return window.notify({ type: 'error', description: er.message })
    }
  }, [dispatch, getTargetEtherWallet, hasProvider])

  useEffect(() => {
    if (targetChain === CHAIN_ID_SOLANA) {
      autoConnectSolWallet()
    }
    if (targetChain === CHAIN_ID_ETH) {
      autoConnectEtherWallet()
    }
  }, [autoConnectEtherWallet, autoConnectSolWallet, targetChain])

  return (
    <Row gutter={[16, 16]} align="middle">
      <Col flex="auto">
        <Network
          address={targetWalletAddress}
          chainId={targetChain}
          onChange={onChooseWallet}
        />
      </Col>
      {targetChain !== CHAIN_ID_SOLANA ? (
        <Col>
          <NetworkConnect
            connected={!!targetWalletAddress}
            onConnect={onConnect}
            onDisconnect={onDisconnect}
          />
        </Col>
      ) : (
        <Col>
          <Tag
            style={{
              margin: 0,
              borderRadius: 4,
              background: 'rgba(249, 87, 94, 0.1)',
              color: '#F9575E',
              textTransform: 'capitalize',
              border: 'none',
            }}
          >
            {targetWalletAddress ? 'Connected' : 'Not Connected'}
          </Tag>
        </Col>
      )}
    </Row>
  )
}

export default TargetWallet

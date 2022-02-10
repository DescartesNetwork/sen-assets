import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { account } from '@senswap/sen-js'
import { useWallet } from '@senhub/providers'

import { Col, Row, Tag } from 'antd'
import Network, { NetworkConnect } from './network'

import { AppDispatch, AppState } from 'app/model'
import {
  changeSourceAndTargetChain,
  connectTargetWallet,
  disconnectSourceWallet,
} from 'app/model/wormhole.controller'
import { ChainId, CHAIN_ID_ETH, CHAIN_ID_SOLANA } from '@certusone/wormhole-sdk'
import session from 'shared/session'
import { WOH_WALLET } from 'app/lib/wormhole/constant/wormhole'
import MetamaskWallet from 'app/lib/etherWallet/metamask'
import Coin98Wallet from 'app/lib/etherWallet/coin98'
import { notifyError } from 'app/helper'

const TargetWallet = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    wormhole: {
      targetWalletAddress,
      targetChain,
      sourceWalletAddress,
      sourceChain,
    },
  } = useSelector((state: AppState) => state)
  const [disableSelect, setDisableSelect] = useState(false)

  const getSourceWallet = useCallback((fallback: string = '') => {
    const walletType = session.get(WOH_WALLET) || fallback
    if (walletType === MetamaskWallet.walletType) return new MetamaskWallet()
    if (walletType === Coin98Wallet.walletType) return new Coin98Wallet()
    throw new Error(
      'The application now supports Metamask, and Coin98 Wallet only.',
    )
  }, [])

  const onConnect = useCallback(
    async (type: string = '') => {
      const targetWallet = getSourceWallet(type)
      try {
        dispatch(
          connectTargetWallet({
            wallet: targetWallet,
            targetChain: CHAIN_ID_ETH,
          }),
        )
      } catch (er) {
        notifyError(er)
      }
    },
    [dispatch, getSourceWallet],
  )

  const onDisconnect = useCallback(async () => {
    try {
      let wallet: any
      if (targetChain === CHAIN_ID_SOLANA) {
        wallet = window.sentre.wallet
      } else {
        wallet = getSourceWallet()
      }
      await dispatch(disconnectSourceWallet())
      return wallet.disconnect()
    } catch (er) {
      return notifyError(er)
    }
  }, [dispatch, getSourceWallet, targetChain])

  const onChooseWallet = async (value: ChainId) => {
    let wallet: any
    if (targetChain !== CHAIN_ID_SOLANA && !!session.get(WOH_WALLET)) {
      wallet = getSourceWallet()
    } else {
      wallet = window.sentre.wallet
    }
    if (wallet) {
      await dispatch(disconnectSourceWallet())
      wallet.disconnect()
    }
    if (value === CHAIN_ID_SOLANA) {
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
      changeSourceAndTargetChain({ chainID: value, isReverse: true }),
    )
  }

  const autoConnectSolWallet = useCallback(
    async (value) => {
      try {
        await dispatch(
          connectTargetWallet({
            wallet: window.sentre.wallet,
            targetChain: value,
          }),
        ).unwrap()
      } catch (er) {
        return notifyError(er)
      }
    },
    [dispatch],
  )

  useEffect(() => {
    if (targetChain === CHAIN_ID_SOLANA) {
      autoConnectSolWallet(targetChain)
    }
  }, [autoConnectSolWallet, targetChain])

  return (
    <Row gutter={[16, 16]} align="middle">
      <Col flex="auto">
        <Network
          address={targetWalletAddress}
          chainId={targetChain}
          onChange={onChooseWallet}
          disabled={disableSelect}
        />
      </Col>
      {targetChain !== CHAIN_ID_SOLANA ? (
        <Col>
          <NetworkConnect
            chainId={targetChain}
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

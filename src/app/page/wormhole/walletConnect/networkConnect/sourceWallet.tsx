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
  connectTargetWallet,
  disconnectSourceWallet,
  setSourceToken,
} from 'app/model/wormhole.controller'
import session from 'shared/session'
import { WOH_WALLET } from 'app/lib/wormhole/constant/wormhole'
import { notifyError } from 'app/helper'
import { utils, WalletInterface } from '@senswap/sen-js'
import { IEtherWallet } from 'app/lib/etherWallet/walletInterface'
import { useAccount, useMint } from '@senhub/providers'
import { WohTokenInfo } from 'app/constant/types/wormhole'
import { ChainID } from '@certusone/wormhole-sdk/lib/cjs/proto/publicrpc/v1/publicrpc'

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
  const { accounts } = useAccount()
  const { tokenProvider } = useMint()

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
      let sourceWallet: any
      let sourceToken: any = []
      let targetWallet: any
      if (currentSourceChain === CHAIN_ID_SOLANA) {
        sourceWallet = window.sentre.wallet
        targetWallet = getSourceWallet(MetamaskWallet.walletType)
        sourceToken = await Promise.all(
          Object.values(accounts)
            .filter(({ amount }) => !!amount)
            .map(async ({ mint, amount }) => {
              const tokenInfo = await tokenProvider.findByAddress(mint)
              if (!tokenInfo) return
              const tempToken = {
                balance: amount,
                decimals: tokenInfo?.decimals,
                logo: tokenInfo?.logoURI,
                name: tokenInfo?.name,
                symbol: tokenInfo?.symbol,
                token_address: tokenInfo?.address,
                address: tokenInfo?.address,
                amount: utils.undecimalize(amount, tokenInfo?.decimals),
              }
              return tempToken
            }),
        )
        try {
          await dispatch(
            connectSourceWallet({
              wallet: sourceWallet,
              chainID: currentSourceChain,
              sourceToken,
            }),
          ).unwrap()
          dispatch(
            connectTargetWallet({
              wallet: targetWallet,
              targetChain: CHAIN_ID_ETH,
            }),
          )
          return targetWallet.connect()
        } catch (er) {
          notifyError(er)
          return sourceWallet.disconnect()
        }
      } else {
        sourceWallet = getSourceWallet(type)
        targetWallet = window.sentre.wallet
        try {
          await dispatch(
            connectSourceWallet({
              wallet: sourceWallet,
              chainID: currentSourceChain,
            }),
          ).unwrap()
          dispatch(
            connectTargetWallet({
              wallet: targetWallet,
              targetChain: CHAIN_ID_SOLANA,
            }),
          )
          return sourceWallet.connect()
        } catch (er) {
          notifyError(er)
          return sourceWallet.disconnect()
        }
      }
    },
    [accounts, currentSourceChain, dispatch, getSourceWallet, tokenProvider],
  )

  const onDisconnect = useCallback(async () => {
    try {
      let wallet: any
      if (currentSourceChain === CHAIN_ID_SOLANA) {
        wallet = window.sentre.wallet
      } else {
        wallet = getSourceWallet()
      }
      await dispatch(disconnectSourceWallet())
      return wallet.disconnect()
    } catch (er) {
      return notifyError(er)
    }
  }, [currentSourceChain, dispatch, getSourceWallet])

  const onChooseWallet = (value: ChainId) => {
    setCurrentSourceChain(value)
  }

  // reconnect source wallet
  useEffect(() => {
    const walletType = session.get(WOH_WALLET)
    if (!hasProvider || !walletType) return
    const sourceWallet: any = getSourceWallet()
    const targetWallet: any = window.sentre.wallet
    try {
      if (sourceWallet) {
        dispatch(
          connectSourceWallet({
            wallet: sourceWallet,
            chainID: currentSourceChain,
          }),
        )
        dispatch(
          connectTargetWallet({
            wallet: targetWallet,
            targetChain: CHAIN_ID_SOLANA,
          }),
        )
      }
    } catch (er: any) {
      return window.notify({ type: 'error', description: er.message })
    }
  }, [currentSourceChain, dispatch, getSourceWallet, hasProvider])

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

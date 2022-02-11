import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ChainId, CHAIN_ID_SOLANA } from '@certusone/wormhole-sdk'
import { utils } from '@senswap/sen-js'
import { useAccount, useMint } from '@senhub/providers'

import { Col, Row, Tag } from 'antd'
import Network, { NetworkConnect } from './network'

import MetamaskWallet from 'app/lib/etherWallet/metamask'
import Coin98Wallet from 'app/lib/etherWallet/coin98'
import { AppDispatch, AppState } from 'app/model'
import {
  changeSourceAndTargetChain,
  connectSourceWallet,
  disconnectSourceWallet,
} from 'app/model/wormhole.controller'
import session from 'shared/session'
import { WOH_WALLET } from 'app/lib/wormhole/constant/wormhole'
import { notifyError } from 'app/helper'

const SourceWallet = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    wormhole: { sourceWalletAddress, sourceChain },
  } = useSelector((state: AppState) => state)
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

  useEffect(() => {
    setDisableSelect(false)
    if (sourceWalletAddress) {
      setDisableSelect(true)
    }
  }, [sourceWalletAddress])

  // connect source wallet
  const onConnect = useCallback(
    async (type: string = '') => {
      const sourceWallet = getSourceWallet(type)
      try {
        await dispatch(
          connectSourceWallet({
            wallet: sourceWallet,
            chainID: currentSourceChain,
          }),
        ).unwrap()
        return sourceWallet.connect()
      } catch (er) {
        notifyError(er)
        return sourceWallet.disconnect()
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
  }, [dispatch, getSourceWallet])

  const onChooseWallet = async (value: ChainId) => {
    let wallet: any
    if (currentSourceChain !== CHAIN_ID_SOLANA && !!session.get(WOH_WALLET)) {
      wallet = getSourceWallet()
    } else {
      wallet = window.sentre.wallet
    }
    if (wallet) {
      await dispatch(disconnectSourceWallet())
      wallet.disconnect()
    }
    if (value === CHAIN_ID_SOLANA) {
      const sourceToken: any = await Promise.all(
        Object.values(accounts)
          .filter(({ amount }) => !!amount)
          .map(async ({ mint, amount }) => {
            const tokenInfo = await tokenProvider.findByAddress(mint)

            if (!tokenInfo) {
              return
            }
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
            wallet: window.sentre.wallet,
            chainID: value,
            sourceToken,
          }),
        ).unwrap()
      } catch (er) {
        notifyError(er)
        return wallet.disconnect()
      }
    }
    await dispatch(changeSourceAndTargetChain({ chainID: value }))
  }

  useEffect(() => {
    setCurrentSourceAddress(sourceWalletAddress)
    setCurrentSourceChain(sourceChain)
  }, [sourceChain, sourceWalletAddress])

  const autoConnectSolWallet = useCallback(
    async (value) => {
      const sourceToken: any = await Promise.all(
        Object.values(accounts)
          .filter(({ amount }) => !!amount)
          .map(async ({ mint, amount }) => {
            const tokenInfo = await tokenProvider.findByAddress(mint)

            if (!tokenInfo) {
              return
            }
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
            wallet: window.sentre.wallet,
            chainID: value,
            sourceToken,
          }),
        ).unwrap()
      } catch (er) {
        return notifyError(er)
      }
    },
    [accounts, dispatch, tokenProvider],
  )

  useEffect(() => {
    ;(async () => {
      await dispatch(disconnectSourceWallet())
      if (sourceChain === CHAIN_ID_SOLANA) {
        autoConnectSolWallet(sourceChain)
      }
    })()
  }, [autoConnectSolWallet, sourceChain, dispatch])

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
      {currentSourceChain !== CHAIN_ID_SOLANA ? (
        <Col>
          <NetworkConnect
            chainId={currentSourceChain}
            connected={!!sourceWalletAddress}
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
            {sourceWalletAddress ? 'Connected' : 'Not Connected'}
          </Tag>
        </Col>
      )}
    </Row>
  )
}

export default SourceWallet

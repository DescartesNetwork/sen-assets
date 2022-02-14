import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ChainId, CHAIN_ID_ETH, CHAIN_ID_SOLANA } from '@certusone/wormhole-sdk'
import { utils } from '@senswap/sen-js'
import { useAccount, useMint } from '@senhub/providers'
import detectEthereumProvider from '@metamask/detect-provider'

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
import { fetchTokenEther } from 'app/lib/wormhole/helper/ether'
import { WohTokenInfo } from 'app/constant/types/wormhole'

const SourceWallet = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    wormhole: { sourceWalletAddress, sourceChain },
  } = useSelector((state: AppState) => state)
  const { accounts } = useAccount()
  const { tokenProvider } = useMint()
  const [hasProvider, setHasProvider] = useState(false)

  const getSourceEtherWallet = useCallback((fallback: string = '') => {
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

  // connect source wallet
  const onConnect = useCallback(
    async (type: string = '') => {
      const sourceWallet = getSourceEtherWallet(type)
      const address = await sourceWallet.getAddress()
      const sourceToken = await fetchTokenEther(address)
      try {
        await dispatch(
          connectSourceWallet({
            wallet: sourceWallet,
            chainID: sourceChain,
            sourceToken,
          }),
        ).unwrap()
        return sourceWallet.connect()
      } catch (er) {
        notifyError(er)
        return sourceWallet.disconnect()
      }
    },
    [sourceChain, dispatch, getSourceEtherWallet],
  )

  const onDisconnect = useCallback(async () => {
    try {
      const wallet = getSourceEtherWallet()
      await dispatch(disconnectSourceWallet())
      return wallet.disconnect()
    } catch (er) {
      return notifyError(er)
    }
  }, [dispatch, getSourceEtherWallet])

  const onChooseWallet = async (value: ChainId) => {
    let targetChain: ChainId = CHAIN_ID_SOLANA

    if (value === CHAIN_ID_SOLANA) {
      targetChain = CHAIN_ID_ETH
      const sourceToken: WohTokenInfo[] = []
      const hasBalanceAccounts = Object.values(accounts).filter(
        ({ amount }) => !!amount,
      )
      for (let i = 0; i < hasBalanceAccounts.length; i++) {
        const tokenInfo = await tokenProvider.findByAddress(
          hasBalanceAccounts[i].mint,
        )

        if (!tokenInfo) {
          continue
        }
        const tempToken: WohTokenInfo = {
          decimals: tokenInfo?.decimals,
          logo: tokenInfo?.logoURI || '',
          name: tokenInfo?.name,
          symbol: tokenInfo?.symbol,
          address: tokenInfo?.address,
          amount: Number(
            utils.undecimalize(
              hasBalanceAccounts[i].amount,
              tokenInfo?.decimals,
            ),
          ),
        }
        sourceToken.push(tempToken)
      }
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
      }
    }
    await dispatch(
      changeSourceAndTargetChain({
        sourceChain: value,
        targetChain,
      }),
    )
  }

  const autoConnectSolWallet = useCallback(async () => {
    const sourceToken: WohTokenInfo[] = []
    const hasBalanceAccounts = Object.values(accounts).filter(
      ({ amount }) => !!amount,
    )
    for (let i = 0; i < hasBalanceAccounts.length; i++) {
      const tokenInfo = await tokenProvider.findByAddress(
        hasBalanceAccounts[i].mint,
      )

      if (!tokenInfo) {
        continue
      }
      const tempToken: WohTokenInfo = {
        decimals: tokenInfo?.decimals,
        logo: tokenInfo?.logoURI || '',
        name: tokenInfo?.name,
        symbol: tokenInfo?.symbol,
        address: tokenInfo?.address,
        amount: Number(
          utils.undecimalize(hasBalanceAccounts[i].amount, tokenInfo?.decimals),
        ),
      }
      sourceToken.push(tempToken)
    }
    try {
      await dispatch(
        connectSourceWallet({
          wallet: window.sentre.wallet,
          chainID: CHAIN_ID_SOLANA,
          sourceToken,
        }),
      ).unwrap()
    } catch (er) {
      return notifyError(er)
    }
  }, [accounts, dispatch, tokenProvider])

  const autoConnectEtherWallet = useCallback(async () => {
    const walletType = session.get(WOH_WALLET)
    if (!hasProvider || !walletType)
      return await dispatch(disconnectSourceWallet())
    const wallet = getSourceEtherWallet()
    const address = await wallet.getAddress()
    const sourceToken = await fetchTokenEther(address)
    try {
      if (wallet)
        dispatch(
          connectSourceWallet({
            wallet,
            chainID: CHAIN_ID_ETH,
            sourceToken,
          }),
        )
    } catch (er: any) {
      return window.notify({ type: 'error', description: er.message })
    }
  }, [dispatch, getSourceEtherWallet, hasProvider])

  useEffect(() => {
    if (sourceChain === CHAIN_ID_SOLANA) {
      autoConnectSolWallet()
    }
    if (sourceChain === CHAIN_ID_ETH) {
      autoConnectEtherWallet()
    }
  }, [autoConnectEtherWallet, autoConnectSolWallet, dispatch, sourceChain])

  return (
    <Row gutter={[16, 16]}>
      <Col flex="auto">
        <Network
          address={sourceWalletAddress}
          chainId={sourceChain}
          onChange={onChooseWallet}
        />
      </Col>
      {sourceChain !== CHAIN_ID_SOLANA ? (
        <Col>
          <NetworkConnect
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

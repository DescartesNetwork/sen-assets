import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { account } from '@senswap/sen-js'
import { useWallet } from '@senhub/providers'

import { Col, Row, Tag } from 'antd'
import Network from './network'

import { AppDispatch, AppState } from 'app/model'
import { connectTargetWallet } from 'app/model/wormhole.controller'

const TargetWallet = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    wormhole: { targetWalletAddress, targetChain },
  } = useSelector((state: AppState) => state)
  const {
    wallet: { address: walletAddress },
  } = useWallet()

  useEffect(() => {
    const wallet = window.sentre.wallet
    if (!wallet || !account.isAddress(walletAddress)) return
    dispatch(connectTargetWallet({ wallet }))
  }, [walletAddress, dispatch])

  return (
    <Row gutter={[16, 16]} align="middle">
      <Col flex="auto">
        <Network address={targetWalletAddress} chainId={targetChain} />
      </Col>
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
          Connected
        </Tag>
      </Col>
    </Row>
  )
}

export default TargetWallet

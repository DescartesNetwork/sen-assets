import { Col, Row, Tag } from 'antd'
import { AppState } from 'app/model'
import { connectTargetWallet } from 'app/model/wormhole.controller'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useWallet } from 'senhub/providers'
import Network from './network'

const TargetWallet = () => {
  const dispatch = useDispatch()
  const { targetWalletAddress, targetChain } = useSelector(
    (state: AppState) => state.wormhole,
  )
  const {
    wallet: { address },
  } = useWallet()

  useEffect(() => {
    const wallet = window.sentre.wallet
    if (!wallet || !address) return
    dispatch(connectTargetWallet({ wallet }))
  }, [address, dispatch])

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

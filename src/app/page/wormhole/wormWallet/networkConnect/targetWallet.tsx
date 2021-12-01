import { ChainId } from '@certusone/wormhole-sdk'
import { AppState } from 'app/model'
import { setTargetChain } from 'app/model/wormhole.controller'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Network from './network'

const CHAIN_ID_SOLANA = 1

const TargetWallet = () => {
  const dispatch = useDispatch()
  const { targetWalletAddress, targetChain } = useSelector(
    (state: AppState) => state.wormhole,
  )

  const onChange = (chainId: ChainId) => dispatch(setTargetChain({ chainId }))

  useEffect(() => {
    dispatch(setTargetChain({ chainId: CHAIN_ID_SOLANA }))
  }, [dispatch])

  return (
    <Network
      address={targetWalletAddress}
      chainId={targetChain}
      onChange={onChange}
    />
  )
}

export default TargetWallet

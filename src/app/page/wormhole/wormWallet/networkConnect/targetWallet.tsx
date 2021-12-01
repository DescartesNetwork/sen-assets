import { AppState } from 'app/model'
import { connectTargetWallet } from 'app/model/wormhole.controller'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Network from './network'

const TargetWallet = () => {
  const dispatch = useDispatch()
  const { targetWalletAddress, targetChain } = useSelector(
    (state: AppState) => state.wormhole,
  )

  useEffect(() => {
    const wallet = window.sentre.wallet
    if (!wallet) return
    dispatch(connectTargetWallet({ wallet }))
  }, [dispatch])

  return <Network address={targetWalletAddress} chainId={targetChain} />
}

export default TargetWallet

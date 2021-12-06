import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Button } from 'antd'
import IonIcon from 'shared/ionicon'

import {
  STEP_TRANSFER_AMOUNT,
  TransferState,
  WormholeStatus,
} from 'app/lib/wormhole/constant/wormhole'
import { AppDispatch, AppState } from 'app/model'
import { updateWormholeHistory } from 'app/model/history.controller'
import { restoreTransfer, setProcess } from 'app/model/wormhole.controller'
import { explorer } from 'shared/util'
import { WormholeTransfer } from 'app/lib/wormhole/transfer'

const ColumAction = ({ data }: { data: TransferState }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { processId, sourceTokens, tokenAddress } = useSelector(
    (state: AppState) => state.wormhole,
  )

  const status = useMemo((): WormholeStatus => {
    if (data.transferData.step === STEP_TRANSFER_AMOUNT) return 'success'
    if (processId === data.context.id) return 'pending'
    return 'error'
  }, [data.context.id, data.transferData.step, processId])

  const onUpdate = async (stateTransfer: TransferState) => {
    return dispatch(updateWormholeHistory({ stateTransfer }))
  }

  const onRetry = async () => {
    try {
      await dispatch(restoreTransfer({ historyData: data })).unwrap()
      await dispatch(setProcess({ id: data.context.id })).unwrap()
      //Transfer
      const { sourceWallet, targetWallet } = window.wormhole
      const tokenTransfer = sourceTokens[tokenAddress]
      if (!sourceWallet.ether || !targetWallet.sol || !tokenTransfer)
        throw new Error('Login fist')

      const wormholeTransfer = new WormholeTransfer(
        sourceWallet.ether,
        targetWallet.sol,
        tokenTransfer,
      )
      await wormholeTransfer.restore(data.context.id)
      await onUpdate(data)
      const txId = await wormholeTransfer.transfer(
        data.transferData.amount,
        onUpdate,
      )
      window.notify({
        type: 'success',
        description: 'Transfer successfully',
        onClick: () => window.open(explorer(txId), '_blank'),
      })
    } catch (error) {
      console.log('error', error)
      await dispatch(setProcess({ id: '' })).unwrap()
      window.notify({ type: 'error', description: (error as any).message })
    }
  }

  // action button success
  if (status === 'success')
    return (
      <Button
        type="text"
        size="large"
        onClick={() => window.open(explorer(data.transferData.txId), '_blank')}
        icon={<IonIcon name="open-outline" />}
      />
    )

  // action button retry
  if (status === 'error')
    return (
      <Button type="primary" size="small" onClick={onRetry}>
        Retry
      </Button>
    )

  // status pending
  return null
}

export default ColumAction

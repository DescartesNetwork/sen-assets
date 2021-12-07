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

const ColumAction = ({ transferState }: { transferState: TransferState }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { processId, sourceTokens, tokenAddress } = useSelector(
    (state: AppState) => state.wormhole,
  )
  const { context, transferData } = transferState

  const status = useMemo((): WormholeStatus => {
    if (transferData.step === STEP_TRANSFER_AMOUNT) return 'success'
    if (processId === context.id) return 'pending'
    return 'failed'
  }, [context.id, processId, transferData.step])

  const onUpdate = async (stateTransfer: TransferState) => {
    return dispatch(updateWormholeHistory({ stateTransfer }))
  }

  const onRetry = async () => {
    try {
      await dispatch(restoreTransfer({ historyData: transferState })).unwrap()
      await dispatch(setProcess({ id: context.id })).unwrap()
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
      await wormholeTransfer.restore(context.id)
      await onUpdate(transferState)
      const txId = await wormholeTransfer.transfer(
        transferData.amount,
        onUpdate,
      )
      window.notify({
        type: 'success',
        description: 'Transfer successfully',
        onClick: () => window.open(explorer(txId), '_blank'),
      })
    } catch (error) {
      window.notify({ type: 'error', description: (error as any).message })
    } finally {
      await dispatch(setProcess({ id: '' })).unwrap()
    }
  }

  // action button success
  if (status === 'success')
    return (
      <Button
        type="text"
        size="large"
        onClick={() =>
          window.open(explorer(transferState.transferData.txId), '_blank')
        }
        icon={<IonIcon name="open-outline" />}
      />
    )

  // action button retry
  if (status === 'failed')
    return (
      <Button type="primary" size="small" onClick={onRetry}>
        Retry
      </Button>
    )

  // status pending
  return null
}

export default ColumAction

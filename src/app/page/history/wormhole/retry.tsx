import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Button } from 'antd'

import {
  STEP_TRANSFER_AMOUNT,
  WormholeStatus,
} from 'app/lib/wormhole/constant/wormhole'
import { WormholeProvider } from 'app/lib/wormhole/provider'
import { AppDispatch, AppState } from 'app/model'
import {
  HistoryWormhole,
  updateWormholeHistory,
} from 'app/model/history.controller'
import {
  restoreTransfer,
  setProcess,
  transfer,
} from 'app/model/wormhole.controller'

const RetryTransfer = ({ data }: { data: HistoryWormhole }) => {
  const { processId } = useSelector((state: AppState) => state.wormhole)
  const dispatch = useDispatch<AppDispatch>()

  const status = useMemo((): WormholeStatus => {
    if (data.transfer.step === STEP_TRANSFER_AMOUNT) return 'success'
    if (processId === data.context.id) return 'pending'
    return 'error'
  }, [data.context.id, data.transfer.step, processId])

  const onUpdate = async (provider: WormholeProvider) => {
    await dispatch(setProcess({ provider }))
    await dispatch(updateWormholeHistory({ provider }))
  }
  const onRetry = async () => {
    const dataRestore = await dispatch(restoreTransfer({ historyData: data }))
    if (!dataRestore.payload) return
    return dispatch(transfer({ onUpdate }))
  }

  if (status !== 'error') return null
  return (
    <Button type="primary" size="small" onClick={onRetry}>
      Retry
    </Button>
  )
}
export default RetryTransfer

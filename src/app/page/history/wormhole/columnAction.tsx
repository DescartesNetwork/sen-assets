import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Button } from 'antd'
import IonIcon from 'shared/ionicon'

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
import { restoreTransfer, transfer } from 'app/model/wormhole.controller'
import { explorer } from 'shared/util'

const ColumAction = ({ data }: { data: HistoryWormhole }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { processId } = useSelector((state: AppState) => state.wormhole)

  const status = useMemo((): WormholeStatus => {
    if (data.transfer.step === STEP_TRANSFER_AMOUNT) return 'success'
    if (processId === data.context.id) return 'pending'
    return 'error'
  }, [data.context.id, data.transfer.step, processId])

  const onUpdate = async (provider: WormholeProvider) => {
    return dispatch(updateWormholeHistory({ provider }))
  }

  const onRetry = async () => {
    const dataRestore = await dispatch(restoreTransfer({ historyData: data }))
    if (!dataRestore.payload) return
    return dispatch(transfer({ onUpdate }))
  }

  // action button success
  if (status === 'success')
    return (
      <Button
        type="text"
        size="large"
        onClick={() =>
          window.open(explorer(data.transfer.redeemSolana.txId), '_blank')
        }
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

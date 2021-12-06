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
import { restoreTransfer, transfer } from 'app/model/wormhole.controller'
import { explorer } from 'shared/util'

const ColumAction = ({ data }: { data: TransferState }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { processId } = useSelector((state: AppState) => state.wormhole)

  const status = useMemo((): WormholeStatus => {
    if (data.transferData.step === STEP_TRANSFER_AMOUNT) return 'success'
    if (processId === data.context.id) return 'pending'
    return 'error'
  }, [data.context.id, data.transferData.step, processId])

  const onUpdate = async (stateTransfer: TransferState) => {
    return dispatch(updateWormholeHistory({ stateTransfer }))
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
          window.open(explorer(data.transferData.redeemSolana.txId), '_blank')
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

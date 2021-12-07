import { useMemo } from 'react'
import { useSelector } from 'react-redux'

import StatusTag from '../statusTags'

import { AppState } from 'app/model'
import {
  STEP_TRANSFER_AMOUNT,
  TransferState,
  WormholeStatus,
} from 'app/lib/wormhole/constant/wormhole'

const ColumnStatus = ({ data }: { data: TransferState }) => {
  const { processId } = useSelector((state: AppState) => state.wormhole)

  const status = useMemo((): WormholeStatus => {
    if (data.transferData.step === STEP_TRANSFER_AMOUNT) return 'success'
    if (processId === data.context.id) return 'pending'
    return 'failed'
  }, [data.context.id, data.transferData.step, processId])

  return <StatusTag tag={status} />
}

export default ColumnStatus

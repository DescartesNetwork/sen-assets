import { useMemo } from 'react'
import { useSelector } from 'react-redux'

import StatusTag from '../statusTags'

import { AppState } from 'app/model'
import {
  StepTransfer,
  TransferState,
  WormholeStatus,
} from 'app/constant/types/wormhole'

const ColumnStatus = ({ data }: { data: TransferState }) => {
  const { processId } = useSelector((state: AppState) => state.wormhole)
  const status = useMemo((): WormholeStatus => {
    if (data.transferData.nextStep === StepTransfer.Finish) return 'success'
    if (processId === data.context.id) return 'pending'
    return 'failed'
  }, [data.context.id, data.transferData.nextStep, processId])

  return <StatusTag tag={status} />
}

export default ColumnStatus

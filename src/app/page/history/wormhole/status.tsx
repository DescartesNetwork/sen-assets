import { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { AppState } from 'app/model'
import { HistoryWormhole } from 'app/model/history.controller'

import {
  STEP_TRANSFER_AMOUNT,
  WormholeStatus,
} from 'app/lib/wormhole/constant/wormhole'
import StatusTag from '../statusTags'

const HistoryStatus = ({ data }: { data: HistoryWormhole }) => {
  const { processId } = useSelector((state: AppState) => state.wormhole)

  const status = useMemo((): WormholeStatus => {
    if (data.transfer.step === STEP_TRANSFER_AMOUNT) return 'success'
    if (processId === data.context.id) return 'pending'
    return 'error'
  }, [data.context.id, data.transfer.step, processId])

  return <StatusTag tag={status} />
}
export default HistoryStatus

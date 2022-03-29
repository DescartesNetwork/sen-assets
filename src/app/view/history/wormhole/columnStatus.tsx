import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Tag } from 'antd'
import StatusTag from '../statusTags'

import { AppDispatch, AppState } from 'app/model'
import {
  StepTransfer,
  TransferState,
  WormholeStatus,
} from 'app/constant/types/wormhole'
import { restoreWohHistory } from 'app/model/wohHistory.controller'

const ColumnStatus = ({ data }: { data: TransferState }) => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    wormhole: { processId },
  } = useSelector((state: AppState) => state)

  const nextStep = data.transferData.nextStep

  const status = useMemo((): WormholeStatus => {
    if (nextStep === StepTransfer.Finish) return 'success'
    if (nextStep === StepTransfer.Unknown) return 'unknown'
    if (processId === data.context.id) return 'pending'
    return 'failed'
  }, [data.context.id, nextStep, processId])

  useEffect(() => {
    dispatch(restoreWohHistory({ id: data.context.id })).unwrap()
  }, [data.context.id, dispatch])

  if (nextStep === StepTransfer.Unknown)
    return (
      <Tag
        style={{
          margin: 0,
          borderRadius: 4,
        }}
        color="processing"
      >
        Checking
      </Tag>
    )
  return <StatusTag tag={status} />
}

export default ColumnStatus

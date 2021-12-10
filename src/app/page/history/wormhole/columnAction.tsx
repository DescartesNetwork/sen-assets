import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Button } from 'antd'
import IonIcon from 'shared/ionicon'

import {
  StepTransfer,
  TransferState,
  WormholeStatus,
} from 'app/lib/wormhole/constant/wormhole'
import { AppDispatch, AppState } from 'app/model'
import { updateWormholeHistory } from 'app/model/history.controller'
import {
  clearProcess,
  fetchEtherTokens,
  restoreTransfer,
  setProcess,
  setVisibleProcess,
} from 'app/model/wormhole.controller'
import { asyncWait, explorer } from 'shared/util'
import { WohEthSol } from 'app/lib/wormhole'
import { notifyError, notifySuccess } from 'app/helper'

const ColumAction = ({ transferState }: { transferState: TransferState }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { processId, sourceTokens, tokenAddress } = useSelector(
    (state: AppState) => state.wormhole,
  )
  const { context, transferData } = transferState

  const status = useMemo((): WormholeStatus => {
    if (transferData.nextStep === StepTransfer.Finish) return 'success'
    if (transferData.nextStep === StepTransfer.Unknown) return 'unknown'
    if (processId === context.id) return 'pending'
    return 'failed'
  }, [context.id, processId, transferData.nextStep])

  const onUpdate = async (stateTransfer: TransferState) => {
    if (stateTransfer.transferData.nextStep === StepTransfer.WaitSigned) {
      await asyncWait(5000)
      await dispatch(fetchEtherTokens())
    }
    return dispatch(updateWormholeHistory({ stateTransfer })).unwrap()
  }

  const onRetry = async () => {
    try {
      await dispatch(restoreTransfer({ transferState: transferState })).unwrap()
      await dispatch(setProcess({ id: context.id })).unwrap()
      //Transfer
      const { sourceWallet, targetWallet } = window.wormhole
      const tokenTransfer = sourceTokens[tokenAddress]
      if (!sourceWallet.ether || !targetWallet.sol || !tokenTransfer)
        throw new Error('Login fist')

      const wormholeTransfer = new WohEthSol(
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
      notifySuccess('Transfer', txId)
      dispatch(clearProcess())
    } catch (er) {
      notifyError(er)
      await dispatch(setProcess({ id: '' }))
    }
  }

  // action button success
  if (status === 'success')
    return (
      <Button
        size="small"
        type="text"
        onClick={() =>
          window.open(explorer(transferState.transferData.txId), '_blank')
        }
        icon={<IonIcon name="open-outline" />}
      />
    )

  // action button retry
  if (status === 'failed')
    return (
      <Button
        type="primary"
        size="small"
        onClick={onRetry}
        disabled={!!processId}
      >
        Retry
      </Button>
    )

  if (status === 'unknown')
  return (
    <Button
      type="primary"
      size="small"
      disabled={true}
    >
      Unknown
    </Button>
  )

  // status pending
  return (
    <Button
      type="text"
      size="small"
      onClick={() => dispatch(setVisibleProcess({ visible: true }))}
    >
      Reopen
    </Button>
  )
}

export default ColumAction

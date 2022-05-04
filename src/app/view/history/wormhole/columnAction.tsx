import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CHAIN_ID_SOLANA } from '@certusone/wormhole-sdk'

import { Button } from 'antd'
import IonIcon from 'shared/antd/ionicon'

import { AppDispatch, AppState } from 'app/model'
import {
  clearProcess,
  fetchEtherTokens,
  restoreTransfer,
  setProcess,
  setVisibleProcess,
} from 'app/model/wormhole.controller'
import { asyncWait, ethExplorer, explorer } from 'shared/util'
import { WohEthSol } from 'app/lib/wormhole'
import { notifyError, notifySuccess } from 'app/helper'
import {
  StepTransfer,
  TransferState,
  WormholeStatus,
} from 'app/constant/types/wormhole'
import { updateWohHistory } from 'app/model/wohHistory.controller'
import WohSolEth from 'app/lib/wormhole/wohSolEth'

const ColumAction = ({ transferState }: { transferState: TransferState }) => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    wormhole: { processId },
  } = useSelector((state: AppState) => state)
  const { context, transferData } = transferState

  const status = useMemo((): WormholeStatus => {
    if (transferData.nextStep === StepTransfer.Finish) return 'success'
    if (processId === context.id) return 'pending'
    if (transferData.nextStep === StepTransfer.Unknown) return 'unknown'
    return 'failed'
  }, [context.id, processId, transferData.nextStep])

  const onUpdate = async (stateTransfer: TransferState) => {
    if (stateTransfer.transferData.nextStep === StepTransfer.WaitSigned) {
      await asyncWait(5000)
      await dispatch(fetchEtherTokens())
    }
    return dispatch(updateWohHistory({ stateTransfer }))
  }

  const onRetry = async () => {
    try {
      await dispatch(restoreTransfer({ transferState: transferState })).unwrap()
      await dispatch(setProcess({ id: context.id })).unwrap()
      //Transfer
      const { sourceWallet, targetWallet } = window.wormhole
      let tokenTransfer = transferState.context.tokenInfo

      let wormholeTransfer
      if (transferState.context.srcChainId === CHAIN_ID_SOLANA) {
        if (!sourceWallet.sol || !targetWallet.ether)
          throw new Error('Wallet is not connected')
        wormholeTransfer = new WohSolEth(
          sourceWallet.sol,
          targetWallet.ether,
          tokenTransfer,
        )
      } else {
        if (!sourceWallet.ether || !targetWallet.sol)
          throw new Error('Wallet is not connected')
        wormholeTransfer = new WohEthSol(
          sourceWallet.ether,
          targetWallet.sol,
          tokenTransfer,
        )
      }

      await wormholeTransfer.restore(transferState)
      await onUpdate(transferState)
      const txId = await wormholeTransfer.transfer(
        transferData.amount,
        onUpdate,
      )
      notifySuccess('Transfer', txId)
      dispatch(clearProcess())
    } catch (er) {
      notifyError(er)
      dispatch(clearProcess())
    }
  }

  const onExplore = () => {
    if (transferState.context.srcChainId === CHAIN_ID_SOLANA) {
      return window.open(explorer(transferState.transferData.txHash), 'blank')
    }
    return window.open(ethExplorer(transferState.transferData.txHash), '_blank')
  }

  // action button success
  if (status === 'success') {
    return (
      <Button
        size="small"
        type="text"
        onClick={onExplore}
        icon={<IonIcon name="open-outline" />}
      />
    )
  }

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

  if (status === 'unknown') return null

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
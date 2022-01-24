import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Button, Checkbox, Col, Row, Space, Typography } from 'antd'
import IonIcon from 'shared/antd/ionicon'
import { Progress } from 'app/components/progress'

import { AppDispatch, AppState } from 'app/model'
import {
  clearProcess,
  fetchEtherTokens,
  setWaiting,
  setProcess,
} from 'app/model/wormhole.controller'
import { WohEthSol } from 'app/lib/wormhole'
import { notifyError, notifySuccess } from 'app/helper'
import { asyncWait } from 'shared/util'
import { StepTransfer, TransferState } from 'app/constant/types/wormhole'
import { updateWohHistory } from 'app/model/wohHistory.controller'
import WohSolEth from 'app/lib/wormhole/wohSolEth'
import { CHAIN_ID_SOLANA } from '@certusone/wormhole-sdk'

const ConfirmAction = ({
  onClose = () => {},
}: {
  onClose?: (visible: boolean) => void
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    wormhole: {
      sourceTokens,
      tokenAddress,
      amount,
      processId,
      waiting,
      sourceChain,
    },
  } = useSelector((state: AppState) => state)
  const [acceptable, setAcceptable] = useState(false)
  const loading = waiting || !!processId

  const onUpdate = async (stateTransfer: TransferState) => {
    if (stateTransfer.transferData.nextStep === StepTransfer.WaitSigned) {
      await asyncWait(5000)
      await dispatch(fetchEtherTokens())
    }
    await dispatch(setProcess({ id: stateTransfer.context.id }))
    await dispatch(updateWohHistory({ stateTransfer }))
  }

  const onTransfer = async () => {
    await dispatch(setWaiting({ waiting: true }))
    try {
      //Transfer
      const { sourceWallet, targetWallet } = window.wormhole
      const tokenTransfer = sourceTokens[tokenAddress]
      if (!sourceWallet.ether || !targetWallet.sol || !tokenTransfer)
        throw new Error('Wallet is not connected')

      let wormholeTransfer
      if (sourceChain !== CHAIN_ID_SOLANA) {
        wormholeTransfer = new WohEthSol(
          sourceWallet.ether,
          targetWallet.sol,
          tokenTransfer,
        )
      } else {
        wormholeTransfer = new WohSolEth(
          sourceWallet.ether as any,
          targetWallet.sol as any,
          tokenTransfer,
        )
      }

      const txId = await wormholeTransfer.transfer(amount, onUpdate)
      notifySuccess('Transfer', txId)
      dispatch(clearProcess())
      return onClose(false)
    } catch (er) {
      notifyError(er)
      dispatch(clearProcess())
    } finally {
      await dispatch(setWaiting({ waiting: false }))
    }
  }

  return (
    <Row gutter={[8, 8]} justify="center">
      <Col span={24} style={{ textAlign: 'justify' }}>
        <Space align="start">
          <Typography.Text style={{ color: '#D72311' }}>
            <IonIcon name="alert-circle-outline" />
          </Typography.Text>
          <Typography.Text style={{ color: '#D72311', fontSize: 12 }}>
            You should wait until the process is complete or you can minimize
            this dialog. However, the process will be failed if you exit the Sen
            Assets, or change the network.
          </Typography.Text>
        </Space>
      </Col>
      <Col span={24}>
        {loading ? (
          <Progress />
        ) : (
          <Checkbox
            checked={acceptable}
            onChange={() => setAcceptable(!acceptable)}
            disabled={loading}
          >
            I have read and aggreed!
          </Checkbox>
        )}
      </Col>
      <Col span={24}>
        <Button
          onClick={onTransfer}
          type="primary"
          block
          disabled={!acceptable}
          loading={loading}
        >
          Approve {amount} token
        </Button>
      </Col>
      <Col>
        <Button type="text" onClick={() => onClose(false)}>
          {loading ? 'Minimize' : 'Cancel'}
        </Button>
      </Col>
    </Row>
  )
}

export default ConfirmAction

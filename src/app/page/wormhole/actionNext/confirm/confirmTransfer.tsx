import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Button, Checkbox, Col, Row, Space, Typography } from 'antd'
import IonIcon from 'shared/antd/ionicon'
import { Progress } from 'app/components/progress'

import { AppDispatch, AppState } from 'app/model'
import {
  clearProcess,
  fetchEtherTokens,
  setProcess,
} from 'app/model/wormhole.controller'
import { WohEthSol } from 'app/lib/wormhole'
import { notifyError, notifySuccess } from 'app/helper'
import { asyncWait } from 'shared/util'
import { StepTransfer, TransferState } from 'app/constant/types/wormhole'
import { updateWohHistory } from 'app/model/wohHistory.controller'
import { getEtherNetwork } from 'app/lib/wormhole/helper/utils'

const ConfirmAction = ({
  onClose = () => {},
}: {
  onClose?: (visible: boolean) => void
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { sourceTokens, tokenAddress, amount, processId } = useSelector(
    (state: AppState) => state.wormhole,
  )
  const [acceptable, setAcceptable] = useState(false)
  const [waiting, setWaiting] = useState(false)
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
    await setWaiting(true)
    try {
      //Transfer
      // if (window.ethereum) {
      //   console.log(Object.keys(window.ethereum))
      // }
      const chainId = getEtherNetwork() === 'goerli' ? '0x5' : '0x1'
      if (window.ethereum) {
        const windowEthereum: any = window.ethereum
        await windowEthereum.request({
          method: 'wallet_switchEthereumChain',
          params: [
            {
              chainId: chainId,
            },
          ],
        })
      }
      const { sourceWallet, targetWallet } = window.wormhole
      const tokenTransfer = sourceTokens[tokenAddress]
      if (!sourceWallet.ether || !targetWallet.sol || !tokenTransfer)
        throw new Error('Login fist')

      let wormholeTransfer = new WohEthSol(
        sourceWallet.ether,
        targetWallet.sol,
        tokenTransfer,
      )

      const txId = await wormholeTransfer.transfer(amount, onUpdate)
      notifySuccess('Transfer', txId)
      dispatch(clearProcess())
      return onClose(false)
    } catch (er) {
      notifyError(er)
      await dispatch(setProcess({ id: '' }))
    } finally {
      setWaiting(false)
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
            this dialog. However, the process will fail if you exit the Sen
            Assets.
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
            I have read and understood
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

import { useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CHAIN_ID_SOLANA, CHAIN_ID_ETH } from '@certusone/wormhole-sdk'
import { utils } from '@senswap/sen-js'

import { Button, Checkbox, Col, Row, Space, Typography } from 'antd'
import IonIcon from 'shared/antd/ionicon'
import { Progress } from 'app/components/progress'

import { AppDispatch, AppState } from 'app/model'
import {
  clearProcess,
  fetchEtherTokens,
  setWaiting,
  setProcess,
  updateSolTokens,
} from 'app/model/wormhole.controller'
import { WohEthSol } from 'app/lib/wormhole'
import { notifyError, notifySuccess } from 'app/helper'
import { asyncWait } from 'shared/util'
import {
  StepTransfer,
  TransferState,
  WohTokenInfo,
} from 'app/constant/types/wormhole'
import { updateWohHistory } from 'app/model/wohHistory.controller'
import WohSolEth from 'app/lib/wormhole/wohSolEth'

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
      sourceWalletAddress,
    },
  } = useSelector((state: AppState) => state)
  const [acceptable, setAcceptable] = useState(false)

  const loading = waiting || !!processId

  const onTransfer = async () => {
    await dispatch(setWaiting({ waiting: true }))
    try {
      //Transfer
      const { sourceWallet, targetWallet } = window.wormhole
      const tokenTransfer = sourceTokens[tokenAddress]
      const { ether: etherSource, sol: solSource } = sourceWallet
      const { ether: etherTarget, sol: solTarget } = targetWallet

      let wormholeTransfer
      switch (sourceChain) {
        case CHAIN_ID_SOLANA:
          if (!solSource || !etherTarget)
            throw new Error('Wallet is not connected')
          wormholeTransfer = new WohSolEth(
            solSource,
            etherTarget,
            tokenTransfer,
          )
          break

        case CHAIN_ID_ETH:
          if (!etherSource || !solTarget)
            throw new Error('Wallet is not connected')
          wormholeTransfer = new WohEthSol(
            etherSource,
            solTarget,
            tokenTransfer,
          )
          break
        default:
          throw new Error('Wallet is not connected!')
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

  const onUpdateSourceToken = useCallback(async () => {
    if (sourceChain === CHAIN_ID_ETH) {
      console.log('this')
      return await dispatch(fetchEtherTokens())
    }

    if (sourceChain === CHAIN_ID_SOLANA) {
      const { splt } = window.sentre
      const accountAddress = await splt.deriveAssociatedAddress(
        sourceWalletAddress,
        tokenAddress,
      )
      const accountData = await splt.getAccountData(accountAddress)
      const tokenTransfer = sourceTokens[tokenAddress]
      const newSourceTokens: Record<string, WohTokenInfo> = JSON.parse(
        JSON.stringify(sourceTokens),
      )
      newSourceTokens[tokenAddress].amount = Number(
        utils.undecimalize(accountData.amount, tokenTransfer.decimals),
      )
      await dispatch(updateSolTokens({ sourceTokens: newSourceTokens }))
    }
  }, [dispatch, sourceChain, sourceTokens, sourceWalletAddress, tokenAddress])

  const onUpdate = useCallback(
    async (stateTransfer: TransferState) => {
      if (stateTransfer.transferData.nextStep === StepTransfer.WaitSigned) {
        await asyncWait(5000)
        await onUpdateSourceToken()
      }

      await dispatch(setProcess({ id: stateTransfer.context.id }))
      await dispatch(updateWohHistory({ stateTransfer }))
    },
    [dispatch, onUpdateSourceToken],
  )

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

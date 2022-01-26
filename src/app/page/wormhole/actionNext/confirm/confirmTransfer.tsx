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
  fetchSolTokens,
} from 'app/model/wormhole.controller'
import { WohEthSol } from 'app/lib/wormhole'
import { notifyError, notifySuccess } from 'app/helper'
import { asyncWait } from 'shared/util'
import { StepTransfer, TransferState } from 'app/constant/types/wormhole'
import { updateWohHistory } from 'app/model/wohHistory.controller'
import WohSolEth from 'app/lib/wormhole/wohSolEth'
import { CHAIN_ID_SOLANA, CHAIN_ID_ETH } from '@certusone/wormhole-sdk'
import { useAccount, useMint } from '@senhub/providers'
import { utils } from '@senswap/sen-js'
// import { useSolWallet } from 'app/lib/wormhole/helper/solana'

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
  const { accounts } = useAccount()
  const { tokenProvider } = useMint()
  const loading = waiting || !!processId

  const onUpdate = async (stateTransfer: TransferState) => {
    if (stateTransfer.transferData.nextStep === StepTransfer.WaitSigned) {
      await asyncWait(5000)
      if (stateTransfer.context.srcChainId === CHAIN_ID_ETH) {
        await dispatch(fetchEtherTokens())
      }
      if (stateTransfer.context.srcChainId === CHAIN_ID_SOLANA) {
        const sourceToken: any = await Promise.all(
          Object.values(accounts)
            .filter(({ amount }) => !!amount)
            .map(async ({ mint, amount }) => {
              const tokenInfo = await tokenProvider.findByAddress(mint)

              if (!tokenInfo) {
                return
              }
              const tempToken = {
                balance: amount,
                decimals: tokenInfo?.decimals,
                logo: tokenInfo?.logoURI,
                name: tokenInfo?.name,
                symbol: tokenInfo?.symbol,
                token_address: tokenInfo?.address,
                address: tokenInfo?.address,
                amount: utils.undecimalize(amount, tokenInfo?.decimals),
              }
              console.log(tempToken, 'sslslslssourcetoken')
              return tempToken
            }),
        )
        await dispatch(fetchSolTokens(sourceToken))
      }
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
      const { ether: etherSource, sol: solSource } = sourceWallet
      const { ether: etherTarget, sol: solTarget } = targetWallet

      let wormholeTransfer
      if (sourceChain !== CHAIN_ID_SOLANA) {
        if (!etherSource || !solTarget)
          throw new Error('Wallet is not connected')
        wormholeTransfer = new WohEthSol(etherSource, solTarget, tokenTransfer)
      } else {
        if (!solSource || !etherTarget)
          throw new Error('Wallet is not connected')
        wormholeTransfer = new WohSolEth(solSource, etherTarget, tokenTransfer)
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

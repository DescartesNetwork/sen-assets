import {
  getEmitterAddressSolana,
  getIsTransferCompletedEth,
  getSignedVAA,
  parseSequenceFromLogSolana,
} from '@certusone/wormhole-sdk'
import { Connection } from '@solana/web3.js'
import { StepTransfer, TransferState } from 'app/constant/types/wormhole'
import { provider, web3ProviderEther } from 'app/lib/etherWallet/ethersConfig'

export const getSolConnection = () => {
  const nodeUrl = window.sentre.splt.nodeUrl
  return new Connection(nodeUrl, 'confirmed')
}

export const restoreSol = async (
  state: TransferState,
): Promise<TransferState> => {
  const cloneState: TransferState = JSON.parse(JSON.stringify(state))
  const { transferData, context } = cloneState
  const txHash = transferData.txHash
  if (!txHash) throw new Error('Invalid txHash')

  // const value = await provider.getTransactionReceipt(txHash)
  const value = await window.sentre.splt.connection.getTransaction(txHash)
  if (!value) return cloneState
  const sequence = parseSequenceFromLogSolana(value)
  const emitterAddress = await getEmitterAddressSolana(
    context.srcTokenBridgeAddress,
  )

  transferData.sequence = sequence

  transferData.emitterAddress = emitterAddress

  try {
    const { vaaBytes } = await getSignedVAA(
      context.wormholeRpc,
      context.srcChainId,
      emitterAddress,
      sequence,
    )
    transferData.vaaHex = Buffer.from(vaaBytes).toString('hex')

    const isRedeemed = await getIsTransferCompletedEth(
      context.targetTokenBridgeAddress,
      web3ProviderEther,
      vaaBytes,
    )
    if (isRedeemed) transferData.nextStep = StepTransfer.Finish
    else transferData.nextStep = StepTransfer.WaitSigned
  } catch (error) {
    transferData.nextStep = StepTransfer.WaitSigned
  }
  return cloneState
}

import { ChainId, getSignedVAA } from '@certusone/wormhole-sdk'
import { Connection } from '@solana/web3.js'
import {
  AttestData,
  StepTransfer,
  TransferData,
  TransferState,
  WormholeContext,
  WormholeStoreKey,
} from 'app/constant/types/wormhole'
import { asyncWait } from 'shared/util'

import { getWormholeDb, setWormholeDb } from './helper/utils'

export class WormholeProvider {
  protected context: WormholeContext | undefined
  protected transferData: TransferData | undefined
  protected attestData: AttestData | undefined

  static fetchAll = async (): Promise<Record<string, TransferState>> => {
    const data = await getWormholeDb<Record<string, TransferState>>(
      WormholeStoreKey.Transfer,
    )
    return JSON.parse(JSON.stringify(data)) || {}
  }

  private getContext = () => {
    if (!this.context) throw new Error('Invalid context')
    return this.context
  }

  restore = async (stateBackup: TransferState) => {
    const stateClone = JSON.parse(JSON.stringify(stateBackup))
    if (!stateBackup) throw new Error('Not find state transfer')
    this.transferData = stateClone.transferData
    this.attestData = stateClone.attestData
    this.context = stateClone.context
  }

  /**
   * Transfer: to bridge tokens from origin chain to destination chain
   * The token must be attested beforehand
   * @param amount
   * @returns
   */
  transfer = async (
    amount: string,
    onUpdate: (state: TransferState) => void,
  ) => {
    const context = this.getContext()
    // init data transfer
    if (!this.transferData)
      this.transferData = await this.initTransferData(amount)
    const { transferData } = this.getState()
    const { attested } = await this.isAttested()
    if (!attested) await this.attest(onUpdate)

    if (transferData.nextStep === StepTransfer.Transfer) {
      const { emitterAddress, sequence, txHash } = await this.submitTransfer()

      context.id = txHash
      transferData.txHash = txHash
      transferData.emitterAddress = emitterAddress
      transferData.sequence = sequence
      transferData.nextStep = StepTransfer.WaitSigned
      const newState = await this.backup()
      await onUpdate(newState)
    }
    if (transferData.nextStep === StepTransfer.WaitSigned) {
      const vaaHex = await this.getSignedVAA(
        transferData.emitterAddress,
        transferData.sequence,
      )
      transferData.vaaHex = vaaHex
      transferData.nextStep = StepTransfer.Redeem
      const newState = await this.backup()
      await onUpdate(newState)
    }
    if (transferData.nextStep === StepTransfer.Redeem) {
      const newTxId = await this.redeem(transferData.vaaHex)
      transferData.txId = newTxId
      transferData.nextStep = StepTransfer.Finish
      const newState = await this.backup()
      await onUpdate(newState)
      return newTxId
    }
    throw new Error('Invalid step transfer')
  }

  protected getConnection() {
    const nodeUrl = window.sentre.splt.nodeUrl
    return new Connection(nodeUrl, 'confirmed')
  }

  protected backup = async () => {
    const database = await WormholeProvider.fetchAll()
    const state = this.getState()
    database[state.context.id] = state
    setWormholeDb(WormholeStoreKey.Transfer, database)
    return state
  }

  protected getState = (): TransferState => {
    if (!this.transferData) throw new Error('Invalid data transfer')
    if (!this.context) throw new Error('Invalid context')
    return {
      transferData: this.transferData,
      context: this.context,
      attestData: this.attestData,
    }
  }

  protected getSignedVAAWithRetry = async (
    ...args: Parameters<typeof getSignedVAA>
  ) => {
    let attempts = 0
    while (true) {
      try {
        console.log('Retry to get signed vaa:', ++attempts)
        const re = await getSignedVAA(...args)
        return re
      } catch (er) {
        // Nothing
        await asyncWait(10000)
      }
    }
  }

  protected initTransferData = async (
    amount: string,
  ): Promise<TransferData> => {
    throw new Error('Invalid function initTransferData')
  }

  protected isAttested = async (): Promise<{
    attested: boolean
    wrappedMintAddress: string | null
    chainId?: ChainId
  }> => {
    throw new Error('Invalid function isAttested')
  }

  protected submitTransfer = async (): Promise<{
    sequence: string
    emitterAddress: string
    txHash: string
  }> => {
    throw new Error('Invalid function submitTransfer')
  }

  protected submitAttest = async (): Promise<{
    sequence: string
    emitterAddress: string
  }> => {
    throw new Error('Invalid function submitAttest')
  }

  protected wrapToken = async (vaaHex: string): Promise<string> => {
    throw new Error('Invalid function wrapToken')
  }

  protected redeem = async (vaaHex: string): Promise<string> => {
    throw new Error('Invalid function redeem')
  }

  private initAttestData = (): AttestData => {
    if (!this.attestData)
      this.attestData = {
        step: 0,
        sequence: '',
        emitterAddress: '',
        vaaHex: '',
        txId: '',
      }
    return this.attestData
  }

  private attest = async (onUpdate: (state: TransferState) => void) => {
    const attestData = this.initAttestData()
    if (attestData.step === 0) {
      const { emitterAddress, sequence } = await this.submitAttest()
      attestData.emitterAddress = emitterAddress
      attestData.sequence = sequence
      attestData.step++
      const newState = await this.backup()
      await onUpdate(newState)
    }
    if (attestData.step === 1) {
      const vaaHex = await this.getSignedVAA(
        attestData.emitterAddress,
        attestData.sequence,
      )
      attestData.vaaHex = vaaHex
      attestData.step++
      const newState = await this.backup()
      await onUpdate(newState)
    }
    if (attestData.step === 2) {
      const txId = await this.wrapToken(attestData.vaaHex)
      attestData.txId = txId
      attestData.step++
      const newState = await this.backup()
      await onUpdate(newState)
      return txId
    }
    throw new Error('Invalid step attest')
  }

  private async getSignedVAA(emitterAddress: string, sequence: string) {
    const { context } = this.getState()
    // Get signedVAA
    const { vaaBytes } = await this.getSignedVAAWithRetry(
      context.wormholeRpc,
      context.srcChainId,
      emitterAddress,
      sequence,
    )
    const vaaHex = Buffer.from(vaaBytes).toString('hex')
    return vaaHex
  }
}

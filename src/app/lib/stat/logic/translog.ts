//@ts-ignore
import {
  ParsedConfirmedTransaction,
  ParsedInstruction,
  ParsedMessageAccount,
  PartiallyDecodedInstruction,
  TokenBalance,
} from '@solana/web3.js'

import { ActionInfo, ActionTransfer, TransLog } from '../entities/trans-log'
import { Solana } from '../adapters/solana/client'
import {
  ParsedAction,
  ParsedInfoTransfer,
  ParsedType,
} from '../constants/constants'

import { DateHelper } from '../helpers/date'

type InstructionData = ParsedInstruction | PartiallyDecodedInstruction

type TransLogServiceConfig = {
  secondFrom?: number
  secondTo?: number
  lastSignature?: string
}

export class TransLogService {
  solana: Solana
  programId: string
  configs?: TransLogServiceConfig
  constructor(programId: string, configs?: TransLogServiceConfig) {
    this.solana = new Solana()
    this.programId = programId
    this.configs = configs
  }

  async collect(): Promise<TransLog[]> {
    const secondFrom = this.configs?.secondFrom || 0
    const secondTo = this.configs?.secondTo || new Date().getTime() / 1000
    const confirmedTrans = await this.solana.fetchTransactions(
      this.programId,
      secondFrom,
      secondTo,
    )
    const transLogs: Array<TransLog> = []
    for (const trans of confirmedTrans) {
      const log = this.parseTransLog(trans)
      if (log) transLogs.push(log)
    }
    return transLogs
  }

  private parseTransLog(
    confirmedTrans: ParsedConfirmedTransaction,
  ): TransLog | undefined {
    const { blockTime, meta, transaction } = confirmedTrans
    if (!blockTime || !meta) return
    const { postTokenBalances, preTokenBalances, err } = meta
    const { signatures, message } = transaction
    if (err !== null) return

    const innerInstructionData = meta.innerInstructions?.[0]?.instructions || []
    const instructionData = message.instructions[0] || []

    const transLog = new TransLog()
    transLog.signature = signatures[0]
    transLog.blockTime = blockTime
    transLog.time = DateHelper.fromSeconds(blockTime).ymd()
    transLog.programId = instructionData.programId.toString()

    const mapAccount = this.parseAccountInfo(
      message.accountKeys,
      postTokenBalances || [],
      preTokenBalances || [],
    )
    // system program transaction
    if (this.isParsedInstruction(instructionData)) {
      transLog.programTransfer = this.parseAction([instructionData], mapAccount)
      return transLog
    }
    // smart contract transaction
    transLog.actionTransfers = this.parseAction(
      innerInstructionData,
      mapAccount,
    )
    transLog.programInfo = {
      programId: instructionData.programId.toString(),
      data: (instructionData as PartiallyDecodedInstruction).data,
    }
    return transLog
  }

  private isParsedInstruction(instructionData: InstructionData) {
    return (instructionData as ParsedInstruction).parsed !== undefined
  }

  private parseAction(
    actions: InstructionData[],
    mapAccount: Map<string, ActionInfo>,
  ) {
    const actionTransfer: ActionTransfer[] = []
    for (const action of actions) {
      if (!this.isParsedInstruction(action)) continue
      const actionParsed: ParsedAction =
        (action as ParsedInstruction).parsed || {}
      switch (actionParsed.type) {
        case ParsedType.Transfer:
          const info: ParsedInfoTransfer = actionParsed.info
          const parsedAction = this.parseActionTransfer(info, mapAccount)
          if (parsedAction) actionTransfer.push(parsedAction)
          break
        default:
          break
      }
    }
    return actionTransfer
  }

  private parseActionTransfer(
    parsedTransfer: ParsedInfoTransfer,
    mapAccount: Map<string, ActionInfo>,
  ): ActionTransfer | undefined {
    const { source, destination, amount } = parsedTransfer
    if (!amount || !mapAccount.has(source) || !mapAccount.has(destination))
      return

    const actionTransfer = new ActionTransfer()
    actionTransfer.source = mapAccount.get(source)
    actionTransfer.destination = mapAccount.get(destination)
    actionTransfer.amount = amount

    return actionTransfer
  }

  private parseAccountInfo(
    accountKeys: Array<ParsedMessageAccount>,
    postTokenBalances: Array<TokenBalance>,
    preTokenBalances: Array<TokenBalance>,
  ): Map<string, ActionInfo> {
    const mapAccountInfo = new Map<string, ActionInfo>()

    for (const postBalance of postTokenBalances) {
      const { accountIndex, mint, uiTokenAmount } = postBalance
      const info = new ActionInfo()
      info.address = accountKeys[accountIndex].pubkey.toString()
      info.postBalance = uiTokenAmount.amount
      info.mint = mint
      info.decimals = uiTokenAmount.decimals
      mapAccountInfo.set(info.address, info)
    }

    for (const postBalance of preTokenBalances) {
      const { accountIndex, uiTokenAmount } = postBalance
      const address = accountKeys[accountIndex].pubkey.toString()
      const info = mapAccountInfo.get(address) || new ActionInfo()
      info.preBalance = uiTokenAmount.amount
      mapAccountInfo.set(info.address, info)
    }

    return mapAccountInfo
  }
}

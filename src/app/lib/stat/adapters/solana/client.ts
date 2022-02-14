import { CHAIN_ID_ETH } from '@certusone/wormhole-sdk'
import { account } from '@senswap/sen-js'
import {
  ConfirmedSignatureInfo,
  SignaturesForAddressOptions,
  Connection,
  ParsedConfirmedTransaction,
  PublicKey,
  TransactionResponse,
} from '@solana/web3.js'

import {
  StepTransfer,
  TransferData,
  TransferState,
  WohTokenInfo,
} from 'app/constant/types/wormhole'
import { SOL_TOKEN_BRIDGE_ADDRESS } from 'app/lib/wormhole/constant/solConfig'
import { createSolEtherContext } from 'app/lib/wormhole/context'
import { getSolNetwork } from 'app/lib/wormhole/helper/utils'
import { Net } from 'shared/runtime'
import { OptionsFetchSignature } from '../../constants/transaction'
import { getTokenList } from './customedTokenList'

const DEFAULT_LIMIT = 700
const TRANSACTION_LIMIT = 200
const SOL_HISTORY_LIMIT = 4
const SOL_INSTRUCTION_INDEX = 5
const NOMAL_INSTRUCTION_INDEX = 2

type ParsedTransaction = {
  targetChain: number
  amount: number
  token?: string
}

export class Solana {
  private conn: Connection = window.sentre.splt.connection

  //Search for all signatures from last Signature and earlier
  //So: If new collection (to now) -> last Signature = null
  private async fetchSignatures(
    address: PublicKey,
    lastSignature?: string,
    limit: number = DEFAULT_LIMIT,
  ): Promise<Array<ConfirmedSignatureInfo>> {
    if (limit > DEFAULT_LIMIT) limit = DEFAULT_LIMIT
    const options: SignaturesForAddressOptions = {
      limit,
      before: lastSignature,
    }

    return this.conn.getSignaturesForAddress(address, options)
  }

  private async fetchConfirmTransaction(signatures: string[]) {
    let confirmedTransactions: ParsedConfirmedTransaction[] = []
    let limit = TRANSACTION_LIMIT

    const promiseTransGroup = []
    for (let offset = 0; offset <= signatures.length / limit; offset++) {
      const skip = offset * limit
      const signaturesGroup = signatures.slice(skip, skip + limit)
      promiseTransGroup.push(
        this.conn.getParsedConfirmedTransactions(signaturesGroup),
      )
    }

    const transGroups = await Promise.all(promiseTransGroup)
    for (const transGroup of transGroups) {
      //@ts-ignore
      confirmedTransactions = confirmedTransactions.concat(transGroup)
    }

    return confirmedTransactions
  }

  async fetchTransactions(
    programId: string,
    options: OptionsFetchSignature,
  ): Promise<ParsedConfirmedTransaction[]> {
    const currentTime = new Date().getTime() / 1000
    let { secondFrom, secondTo, lastSignature, limit } = options
    secondFrom = Math.floor(secondFrom || 0)
    secondTo = Math.floor(secondTo || currentTime)

    const programPublicKey = new PublicKey(programId)
    let signatures: string[] = []
    let isStop = false

    while (!isStop) {
      const confirmedSignatureInfos: ConfirmedSignatureInfo[] =
        await this.fetchSignatures(programPublicKey, lastSignature, limit)
      if (!confirmedSignatureInfos?.length || isStop) break
      for (const info of confirmedSignatureInfos) {
        const blockTime = info.blockTime
        if (!blockTime || blockTime > secondTo) continue
        if (blockTime < secondFrom) {
          isStop = true
          break
        }
        lastSignature = info.signature
        signatures.push(info.signature)
      }

      if (limit && signatures.length >= limit) break
      if (confirmedSignatureInfos?.length < DEFAULT_LIMIT) break
    }
    const confirmedTransactions = await this.fetchConfirmTransaction(signatures)

    return confirmedTransactions
  }

  async getTransferHistory(address: string, lastSig?: string) {
    let signatureList = await this.fetchSignatures(
      account.fromAddress(address),
      lastSig,
    )
    let newLastSig: string = ''
    const history: TransferState[] = []
    for (let i = 0; i < signatureList.length; i++) {
      try {
        if (history.length >= SOL_HISTORY_LIMIT) {
          newLastSig = signatureList[i - 1]?.signature
          return { history, lastSig: newLastSig }
        }
        const transferState = await this.createTransferState(
          signatureList[i]?.signature,
          address,
        )
        if (transferState) history.push(transferState)
      } catch (error) {}
    }

    return { history, lastSig: newLastSig }
  }

  async getTransactionInfo(sig: string) {
    return await this.conn.getTransaction(sig)
  }

  async createTransferState(
    sig: string,
    address: string,
  ): Promise<TransferState | undefined> {
    const trx = await this.getTransactionInfo(sig)
    const params = await this.parseTransParam(trx)
    const tokenList = await getTokenList()

    if (!params || params.targetChain !== CHAIN_ID_ETH || !params.token) return

    let tokenInfo: WohTokenInfo = {
      decimals: 0,
      logo: '',
      name: 'No Name',
      symbol: 'No',
      address: params.token,
      amount: params.amount,
    }

    const rawTokenInfo = tokenList.find(
      (element) => element.address === params.token,
    )
    if (!!rawTokenInfo) {
      tokenInfo = {
        decimals: rawTokenInfo?.decimals,
        logo: rawTokenInfo?.logoURI || '',
        name: rawTokenInfo?.name,
        symbol: rawTokenInfo?.symbol,
        address: params.token,
        amount: params.amount,
      }
    }

    const ethWallet = await window.wormhole.sourceWallet.ether?.getAddress()

    if (!ethWallet) throw new Error('Wallet is not connected')

    const context = createSolEtherContext(tokenInfo)
    context.id = sig
    context.time = new Date(Number(trx?.blockTime) * 1000).getTime()

    const transferData: TransferData = {
      nextStep: StepTransfer.Unknown,
      amount: params.amount.toString(),
      from: address,
      to: ethWallet,
      emitterAddress: '',
      sequence: '',
      vaaHex: '',
      txId: '',
      txHash: trx?.transaction?.signatures[0] || '',
    }

    return {
      context,
      transferData,
    }
  }

  async parseTransParam(
    trx: TransactionResponse | null,
  ): Promise<ParsedTransaction | undefined> {
    const solNetWork: Net = getSolNetwork()
    const { indexToProgramIds, instructions } = trx?.transaction.message as any
    const programIndexSolBridge =
      instructions[SOL_INSTRUCTION_INDEX]?.programIdIndex
    const programIndexNomalBridge =
      instructions[NOMAL_INSTRUCTION_INDEX]?.programIdIndex
    const solTokenBridge = indexToProgramIds
      .get(programIndexSolBridge)
      ?.toBase58()
    const conditions =
      solTokenBridge === SOL_TOKEN_BRIDGE_ADDRESS[solNetWork] ||
      indexToProgramIds.get(programIndexNomalBridge)?.toBase58() ===
        SOL_TOKEN_BRIDGE_ADDRESS[solNetWork]
    const metaToken: any = trx?.meta
    const preTokenBalance =
      metaToken?.preTokenBalances[0].uiTokenAmount.uiAmount
    const postTokenBalance =
      metaToken?.postTokenBalances[0].uiTokenAmount.uiAmount

    if (!conditions) {
      return
    }

    let amount = preTokenBalance - postTokenBalance
    if (solTokenBridge === SOL_TOKEN_BRIDGE_ADDRESS[solNetWork]) {
      amount = postTokenBalance - preTokenBalance
    }

    return {
      amount,
      token: metaToken?.preTokenBalances[0].mint,
      targetChain: CHAIN_ID_ETH,
    }
  }
}

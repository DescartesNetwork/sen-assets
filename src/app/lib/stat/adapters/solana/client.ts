import { CHAIN_ID_ETH } from '@certusone/wormhole-sdk'
import { account } from '@senswap/sen-js'
import { TokenListProvider } from '@solana/spl-token-registry'
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
import {
  SolNetWork,
  SOL_TOKEN_BRIDGE_ADDRESS,
} from 'app/lib/wormhole/constant/solConfig'
import { createSolEtherContext } from 'app/lib/wormhole/context'
import { getSolNetwork } from 'app/lib/wormhole/helper/utils'
import supplementary from 'os/providers/tokenProvider/supplementary'

import { OptionsFetchSignature } from '../../constants/transaction'

const DEFAULT_LIMIT = 700
const TRANSACTION_LIMIT = 200

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

  // This function can return a value in this type : Promise<TransferState[]>
  async getTransferHistory(address: string, lastSig?: string) {
    let listSignature = await this.fetchSignatures(
      account.fromAddress(address),
      lastSig,
    )
    let newLastSig
    // await connection.getTransaction(a[0].signature)
    const history: TransferState[] = []
    for (let i = 0; i < listSignature.length; i++) {
      try {
        if (history.length >= 4) {
          newLastSig = listSignature[i - 1].signature
          return { history, lastSig: newLastSig }
        }
        const transferState = await this.createTransferState(
          listSignature[i].signature,
          address,
        )
        if (transferState) history.push(transferState)
      } catch (error) {}
    }
    // await Promise.all(listSignature.map(async (sig) => {}))
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
    if (!params || params.targetChain !== CHAIN_ID_ETH || !params.token) return
    const tokenPr = new TokenListProvider()
    const tokenRaw = await tokenPr.resolve()
    const tokenList = tokenRaw
      .filterByClusterSlug('mainnet-beta')
      .getList()
      .concat(supplementary)

    let tokenInfo: WohTokenInfo = {
      balance: params.amount,
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
        balance: params.amount,
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
      txHash: trx?.transaction?.signatures[0] as any,
    }
    return {
      context,
      transferData,
    }
  }

  async parseTransParam(
    trx: TransactionResponse | null,
  ): Promise<ParsedTransaction | undefined> {
    const solNetWork: SolNetWork = getSolNetwork()
    const { indexToProgramIds } = trx?.transaction.message as any
    const programIndexSolBridge =
      trx?.transaction.message.instructions[5]?.programIdIndex
    const programIndexNomalBridge =
      trx?.transaction.message.instructions[2]?.programIdIndex
    const conditions =
      indexToProgramIds.get(programIndexSolBridge)?.toBase58() ===
        SOL_TOKEN_BRIDGE_ADDRESS[solNetWork] ||
      indexToProgramIds.get(programIndexNomalBridge)?.toBase58() ===
        SOL_TOKEN_BRIDGE_ADDRESS[solNetWork]
    if (!conditions) {
      return
    }
    let amount =
      (trx?.meta as any)?.preTokenBalances[0].uiTokenAmount.uiAmount -
      (trx?.meta as any)?.postTokenBalances[0].uiTokenAmount.uiAmount
    if (
      indexToProgramIds.get(programIndexSolBridge)?.toBase58() ===
      SOL_TOKEN_BRIDGE_ADDRESS[solNetWork]
    ) {
      amount =
        (trx?.meta as any)?.postTokenBalances[0].uiTokenAmount.uiAmount -
        (trx?.meta as any)?.preTokenBalances[0].uiTokenAmount.uiAmount
    }
    return {
      amount,
      token: (trx?.meta as any)?.preTokenBalances[0].mint,
      targetChain: CHAIN_ID_ETH,
    }
  }
}

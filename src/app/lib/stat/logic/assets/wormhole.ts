import { CHAIN_ID_ETH } from '@certusone/wormhole-sdk'
import { utils } from '@senswap/sen-js'
import { ParsedConfirmedTransaction, ParsedInstruction } from '@solana/web3.js'

import {
  StepTransfer,
  TransferData,
  TransferState,
  WohTokenInfo,
} from 'app/constant/types/wormhole'
import { SOL_TOKEN_BRIDGE_ADDRESS } from 'app/lib/wormhole/constant/solConfig'
import { createSolEtherContext } from 'app/lib/wormhole/context'
import { getSolNetwork } from 'app/lib/wormhole/helper/utils'
import TokenProvider from 'os/providers/tokenProvider'
import { Net } from 'shared/runtime'
import { Solana } from '../../adapters/solana/client'
import { ParsedInfoTransfer } from '../../constants/transaction'
import { TransLogService } from '../translog'

const SECOND_LIMIT = 2592000

type ParsedTransaction = {
  targetChain: number
  amount: number
  token?: string
}

export default class WormholeHistory {
  private solana: Solana = new Solana()
  private tokenProvider = new TokenProvider()
  private transLogService = new TransLogService()

  async getTransferHistory(address: string): Promise<TransferState[]> {
    const history: TransferState[] = []
    const currentTime = new Date().getTime() / 1000
    const detailedTransactions = await this.solana.fetchTransactions(address, {
      secondFrom: currentTime - SECOND_LIMIT,
      secondTo: currentTime,
    })

    await Promise.all(
      detailedTransactions.map(async (transaction) => {
        const transferState = await this.createTransferState(
          transaction,
          address,
        )
        if (!!transferState) history.push(transferState)
      }),
    )

    return history
  }

  async createTransferState(
    trx: ParsedConfirmedTransaction,
    address: string,
  ): Promise<TransferState | undefined> {
    const params = this.parseTransParam(trx)

    if (!params || params.targetChain !== CHAIN_ID_ETH || !params.token) return

    let tokenInfo: WohTokenInfo = {
      decimals: 0,
      logo: '',
      name: 'No Name',
      symbol: 'No',
      address: params.token,
      amount: params.amount,
    }

    const rawTokenInfo = await this.tokenProvider.findByAddress(params.token)
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
    context.id = trx.transaction.signatures[0]
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

  parseTransParam(
    trx: ParsedConfirmedTransaction,
  ): ParsedTransaction | undefined {
    if (!trx.meta) return
    // filter transaction with wormholeProgramId
    const solNetWork: Net = getSolNetwork()
    const wormholeProgramId = SOL_TOKEN_BRIDGE_ADDRESS[solNetWork]
    const { instructions } = trx.transaction.message
    const programIds = instructions.map((data) => data.programId.toBase58())
    if (!programIds.includes(wormholeProgramId)) return

    const { message } = trx.transaction
    const { postTokenBalances, preTokenBalances, postBalances, preBalances } =
      trx.meta

    // get transaction brigde wormhole
    const actionTransferWoh = (instructions as ParsedInstruction[]).find(
      (data) => {
        const parsedData = data as ParsedInstruction
        if (parsedData?.parsed?.type !== 'approve') return false
        return parsedData.program === 'spl-token'
      },
    )
    if (!actionTransferWoh) return
    const transferInfo: ParsedInfoTransfer = actionTransferWoh.parsed.info

    const mapAccountInfo = this.transLogService.parseAccountInfo(
      message.accountKeys,
      postTokenBalances || [],
      preTokenBalances || [],
      postBalances,
      preBalances,
    )
    const tokenInfo = mapAccountInfo.get(transferInfo.source)
    if (!tokenInfo || !Number(transferInfo.amount)) return

    const { mint, decimals } = tokenInfo
    const amount = Number(
      utils.undecimalize(BigInt(transferInfo.amount), decimals),
    )

    return {
      amount,
      token: mint,
      targetChain: CHAIN_ID_ETH,
    }
  }
}

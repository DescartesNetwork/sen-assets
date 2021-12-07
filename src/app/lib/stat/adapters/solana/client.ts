import {
  ConfirmedSignatureInfo,
  ConfirmedSignaturesForAddress2Options,
  Connection,
  ParsedConfirmedTransaction,
  PublicKey,
} from '@solana/web3.js'

const DEFAULT_LIMIT = 700
const TRANSACTION_LIMIT = 150

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
    const options: ConfirmedSignaturesForAddress2Options = {
      limit: limit,
      before: lastSignature,
    }
    return this.conn.getConfirmedSignaturesForAddress2(address, options)
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
    limit: number,
    lastSignature: string | undefined,
    secondFrom: number,
    secondTo: number,
  ): Promise<ParsedConfirmedTransaction[]> {
    secondFrom = Math.floor(secondFrom)
    secondTo = Math.floor(secondTo)

    const programPublicKey = new PublicKey(programId)
    let signatures: string[] = []
    let isStop = false
    const confirmedSignatureInfos: ConfirmedSignatureInfo[] =
      await this.fetchSignatures(programPublicKey, lastSignature, limit)

    while (!isStop) {
      if (!confirmedSignatureInfos?.length || isStop) break
      for (const info of confirmedSignatureInfos) {
        const blockTime = info.blockTime
        if (!blockTime || blockTime > secondTo) continue
        if (blockTime < secondFrom) {
          isStop = true
          break
        }
        signatures.push(info.signature)
      }
      if (confirmedSignatureInfos?.length <= limit) break
    }
    const confirmedTransactions = await this.fetchConfirmTransaction(signatures)
    return confirmedTransactions
  }
}

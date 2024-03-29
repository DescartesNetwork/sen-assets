import { net, PDB } from '@sentre/senhub'
import { TransLog } from 'lib/stat/entities/trans-log'
import { TransLogService } from 'lib/stat/logic/translog'
import { DateHelper } from '../../helpers/date'

const DATE_RANGE = 30

export default class AssetsService {
  programId: string
  transLogService: TransLogService = new TransLogService()
  constructor(address: string) {
    this.programId = address
  }

  private async getPDB(address: string) {
    const walletAddress = await window.sentre.solana?.getAddress()
    if (!walletAddress) throw new Error('Invalid wallet address')
    const key = `sen-assets:${net}:${address}`
    return new PDB(walletAddress).createInstance(key)
  }

  fetchTransLog = async (timeFrom: number, timeTo: number) => {
    const db = await this.getPDB(this.programId)
    let cacheTransLog: TransLog[] = (await db.getItem('translogs')) || []
    const fistTransLog = cacheTransLog[0]
    const lastTransLog = cacheTransLog[cacheTransLog.length - 1]

    if (fistTransLog && lastTransLog) {
      const [beginTransLogs] = await Promise.all([
        this.transLogService.collect(this.programId, {
          secondFrom: fistTransLog.blockTime,
          secondTo: timeTo,
        }),
      ])
      cacheTransLog = cacheTransLog.filter(
        (trans) => trans.blockTime > timeFrom,
      )
      cacheTransLog = [...beginTransLogs, ...cacheTransLog]
    } else {
      cacheTransLog = await this.transLogService.collect(this.programId, {
        secondFrom: timeFrom,
        secondTo: timeTo,
      })
    }
    //
    const mapTransLogs: Record<string, TransLog> = {}
    for (const log of cacheTransLog) mapTransLogs[log.signature] = log

    const newTransLogs = Object.values(mapTransLogs).sort(
      (a, b) => b.blockTime - a.blockTime,
    )
    await db.setItem('translogs', newTransLogs)
    return newTransLogs
  }

  fetchHistory = async () => {
    let timeTo = new DateHelper()
    const timeFrom = new DateHelper().subtractDay(DATE_RANGE)
    // fetch transLog
    const transLogs = await this.fetchTransLog(
      timeFrom.seconds(),
      timeTo.seconds(),
    )
    return transLogs.sort((a, b) => b.blockTime - a.blockTime)
  }
}

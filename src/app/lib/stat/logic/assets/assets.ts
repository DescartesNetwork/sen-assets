import { net } from 'shared/runtime'
import { TransLog } from 'app/lib/stat/entities/trans-log'
import { TransLogService } from 'app/lib/stat/logic/translog'
import PDB from 'shared/pdb'
import { DateHelper } from '../../helpers/date'

const DATE_RANGE = 30

export default class AssetsService {
  programId: string
  transLogService: TransLogService = new TransLogService()
  constructor(address: string) {
    this.programId = address
  }

  fetchTransLog = async (timeFrom: number, timeTo: number) => {
    const db = new PDB(this.programId).createInstance('sen-assets' + net)
    let cacheTransLog: TransLog[] = (await db.getItem('translogs')) || []
    cacheTransLog = cacheTransLog.sort((a, b) => b.blockTime - a.blockTime)
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
    await db.setItem('translogs', cacheTransLog)
    return cacheTransLog
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

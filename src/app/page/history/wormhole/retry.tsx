import { Button } from 'antd'
import { WormholeProvider } from 'app/lib/wormhole/provider'

import { fetchWormholeHistory, HistoryWormhole, updateWormholeHistory } from 'app/model/history.controller'
import { restoreTransfer, setProcess, transfer } from 'app/model/wormhole.controller'
import { useDispatch } from 'react-redux'

const RetryTransfer = ({ data }: { data: HistoryWormhole }) => {
  const dispatch = useDispatch()

  const onUpdate =  async(provider:WormholeProvider) =>{
    await dispatch(setProcess({provider}))
    await dispatch(updateWormholeHistory({provider}))
  }
  const onRetry = async () => {
    await dispatch(restoreTransfer({ historyData: data }))
    await dispatch(fetchWormholeHistory())
    return dispatch(transfer({onUpdate}))
  }

  return (
    <Button type="primary" size="small" onClick={onRetry}>
      Retry
    </Button>
  )
}
export default RetryTransfer

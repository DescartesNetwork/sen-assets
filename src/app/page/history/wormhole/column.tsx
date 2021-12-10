import moment from 'moment'
import { Space, Typography } from 'antd'
import NetworkAvatar from 'app/components/network/networkAvatar'
import ColumAction from './columnAction'
import HistoryStatus from './status'

import { WormholeContext } from 'app/lib/wormhole/context'
import { shortenAddress } from 'shared/util'
import { TransferState } from 'app/lib/wormhole/constant/wormhole'
import NetworkName from 'app/components/network/networkName'

export const WORMHOLE_COLUMNS = [
  {
    title: 'TIME',
    dataIndex: 'context',
    render: (context: WormholeContext) => {
      return (
        <Typography.Text>
          {moment(context.time).format('DD MMM, YYYY hh:mm')}
        </Typography.Text>
      )
    },
  },
  {
    title: 'TRANSACTION ID',
    render: (data: TransferState) => {
      const txHash = data.transferData.txHash
      return (
        <Typography.Text style={{ fontWeight: 700 }}>
          {txHash ? shortenAddress(txHash, 8, '...') : '--'}
        </Typography.Text>
      )
    },
  },
  {
    title: 'SOURCE - TARGET',
    dataIndex: 'context',
    render: (context: WormholeContext) => (
      <Space>
        <NetworkAvatar chainId={context.srcChainId} />
        <Typography.Text>
          <NetworkName chainId={context.srcChainId} />
        </Typography.Text>{' '}
        -
        <NetworkAvatar chainId={context.targetChainId} />
        <Typography.Text>
          <NetworkName chainId={context.targetChainId} />
        </Typography.Text>
      </Space>
    ),
  },
  {
    title: 'AMOUNT',
    render: (data: TransferState) => {
      return (
        <Typography.Text>
          {data?.transferData?.amount} {data?.context?.tokenInfo?.symbol}
        </Typography.Text>
      )
    },
  },
  {
    title: 'STATUS',
    render: (data: TransferState) => {
      return <HistoryStatus data={data} />
    },
  },
  {
    title: 'ACTION',
    render: (state: TransferState) => {
      return <ColumAction transferState={state} />
    },
  },
]

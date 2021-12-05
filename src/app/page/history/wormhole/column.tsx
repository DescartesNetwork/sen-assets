import { Space, Typography } from 'antd'
import NetworkAvatar from 'app/components/network/networkAvatar'
import RetryTransfer from './retry'
import HistoryStatus from './status'

import { WormholeContext } from 'app/lib/wormhole/context'
import { HistoryWormhole } from 'app/model/history.controller'
import { shortenAddress } from 'shared/util'

export const WORMHOLE_COLUMNS = [
  {
    title: 'TIME',
    dataIndex: 'context',
    render: (context: WormholeContext) => {
      return (
        <Typography.Text>
          {new Date(context.time).toLocaleString()}
        </Typography.Text>
      )
    },
  },
  {
    title: 'TRANSACTION ID',
    dataIndex: 'context',
    render: (context: WormholeContext) => {
      return (
        <Typography.Text style={{ fontWeight: 700 }}>
          {shortenAddress(context.id, 8, '...')}
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
        <Typography.Text>ETH</Typography.Text>-
        <NetworkAvatar chainId={context.targetChainId} />
        <Typography.Text>SOL</Typography.Text>
      </Space>
    ),
  },
  {
    title: 'AMOUNT',
    render: (data: HistoryWormhole) => {
      return (
        <Typography.Text>
          {data?.transfer?.amount} {data?.context?.tokenInfo?.symbol}
        </Typography.Text>
      )
    },
  },
  {
    title: 'STATUS',
    render: (data: HistoryWormhole) => {
      return <HistoryStatus data={data} />
    },
  },
  {
    title: 'ACTION',
    render: (data: HistoryWormhole) => {
      return <RetryTransfer data={data} />
    },
  },
]

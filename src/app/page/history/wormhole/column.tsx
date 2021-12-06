import { Space, Typography } from 'antd'
import NetworkAvatar from 'app/components/network/networkAvatar'
import ColumAction from './columnAction'
import HistoryStatus from './columnStatus'

import { WormholeContext } from 'app/lib/wormhole/context'
import { shortenAddress } from 'shared/util'
import { TransferState } from 'app/lib/wormhole/constant/wormhole'

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
    render: (data: TransferState) => {
      return <ColumAction data={data} />
    },
  },
]

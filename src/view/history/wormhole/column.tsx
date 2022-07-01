import moment from 'moment'

import { Space, Typography } from 'antd'
import NetworkAvatar from 'components/network/networkAvatar'
import ColumAction from './columnAction'
import HistoryStatus from './columnStatus'

import { util } from '@sentre/senhub'
import { TransferState, WormholeContext } from 'constant/types/wormhole'

export const WORMHOLE_COLUMNS = [
  {
    title: 'TIME',
    dataIndex: 'context',
    render: (context: WormholeContext) => {
      return (
        <Typography.Text>
          {moment(context.time).format('MMM DD, YYYY HH:mm')}
        </Typography.Text>
      )
    },
  },
  {
    title: 'Token BRIDGE',
    dataIndex: 'context',
    render: (context: WormholeContext) => (
      <Space>
        <NetworkAvatar chainId={context.srcChainId} />
        <span style={{ whiteSpace: 'nowrap' }}>{`->`}</span>
        <NetworkAvatar chainId={context.targetChainId} />
      </Space>
    ),
  },
  {
    title: 'AMOUNT',
    render: (data: TransferState) => {
      return (
        <Typography.Text>
          {util.numeric(data?.transferData?.amount).format('0,0.[0000]') || 0}{' '}
          {data?.context?.tokenInfo?.symbol}
        </Typography.Text>
      )
    },
  },
  {
    title: 'STATUS',
    width: 100,
    render: (data: TransferState) => {
      return <HistoryStatus data={data} />
    },
  },
  {
    title: 'ACTION',
    width: 100,
    render: (state: TransferState) => {
      return <ColumAction transferState={state} />
    },
  },
]

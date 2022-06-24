import moment from 'moment'

import { Space, Typography } from 'antd'
import NetworkAvatar from 'app/components/network/networkAvatar'
import ColumAction from './columnAction'
import HistoryStatus from './columnStatus'
import NetworkName from 'app/components/network/networkName'

import { numeric } from 'shared/util'
import { TransferState, WormholeContext } from 'app/constant/types/wormhole'

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
        <Typography.Text>
          <NetworkName chainId={context.srcChainId} />
        </Typography.Text>
        <span>-</span>
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
          {numeric(data?.transferData?.amount).format('0,0.[0000]') || 0}{' '}
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

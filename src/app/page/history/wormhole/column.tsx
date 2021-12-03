import { Button, Space, Typography } from 'antd'
import NetworkAvatar from 'app/components/network/networkAvatar'
import { WormholeContext } from 'app/lib/wormhole/context'
import { shortenAddress } from 'shared/util'
import StatusTag from '../statusTags'

export const WORMHOLE_COLUMNS = [
  {
    title: 'TIME',
    dataIndex: 'context',
    key: 'time',
    render: (context: WormholeContext) => {
      return <Typography.Text>{context.time}</Typography.Text>
    },
  },
  {
    title: 'TRANSACTION ID',
    dataIndex: 'context',
    key: 'transactionID',
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
    key: '',
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
    key: 'amount',
    render: (data: any) => {
      return (
        <Typography.Text>
          {data?.transfer?.amount} {data?.context?.tokenInfo?.symbol}
        </Typography.Text>
      )
    },
  },
  {
    title: 'STATUS',
    key: 'status',
    dataIndex: 'status',
    render: (status:string) => {
      return <StatusTag tag={status} />
    },
  },
  {
    title: 'ACTION',
    key: 'action',
    dataIndex: 'status',
    render: (status: string) => {
      if(status === 'pending') return null
      return (
        <Button type="primary" size="small">
          Retry
        </Button>
      )
    },
  },
]

import { Button, Space, Typography } from 'antd'
import StatusTag from '../statusTags'
import IonIcon from 'shared/antd/ionicon'

import { explorer, shortenAddress } from 'shared/util'
import { MintSymbol } from 'app/shared/components/mint'

export const TRANSACTION_COLUMNS = [
  {
    title: 'TIME',
    dataIndex: 'time',
    key: 'time',
  },
  {
    title: 'TRANSACTION ID',
    dataIndex: 'transactionId',
    key: 'transactionId',
    render: (text: string) => (
      <Space align="baseline">
        <Typography.Text
          onClick={() => window.open(explorer(text), '_blank')}
          style={{ fontWeight: 700, cursor: 'pointer' }}
        >
          {shortenAddress(text, 8, '...')}
        </Typography.Text>
        <Button
          type="text"
          size="small"
          onClick={() => window.open(explorer(text), '_blank')}
          icon={<IonIcon name="open-outline" />}
        />
      </Space>
    ),
  },
  {
    title: 'FROM',
    dataIndex: 'from',
    key: 'from',
    render: (text: string) => (
      <Typography.Text>{shortenAddress(text, 8, '...')}</Typography.Text>
    ),
  },
  {
    title: 'TO',
    dataIndex: 'to',
    key: 'to',
    render: (text: string) => (
      <Typography.Text>{shortenAddress(text, 8, '...')}</Typography.Text>
    ),
  },
  {
    title: 'AMOUNT',
    key: 'amount',
    dataIndex: 'amount',
    render: (text: string, record: any) => (
      <Typography.Text
        style={{ color: record.isReceive ? '#14E041' : '#D72311' }}
      >
        <Space size={4}>
          {record.isReceive ? `+${text}` : `-${text}`}{' '}
          <MintSymbol mintAddress={record.mint} />
        </Space>
      </Typography.Text>
    ),
  },
  {
    title: 'STATUS',
    key: 'status',
    dataIndex: 'status',
    render: (text: string) => <StatusTag tag="success" />,
  },
]

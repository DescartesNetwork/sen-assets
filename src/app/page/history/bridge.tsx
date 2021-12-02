import { useState } from 'react'

import { Button, Col, Row, Space, Table, Typography } from 'antd'
import StatusTag from './statusTags'
import IonIcon from 'shared/ionicon'
import { MintAvatar } from 'app/shared/components/mint'

import { shortenAddress } from 'shared/util'

const COLUMNS = [
  {
    title: 'TIME',
    dataIndex: 'time',
    key: 'time',
  },
  {
    title: 'TRANSACTION ID',
    dataIndex: 'transactionID',
    key: 'transactionID',
    render: (text: string) => (
      <Typography.Text style={{ fontWeight: 700 }}>
        {shortenAddress(text, 8, '...')}
      </Typography.Text>
    ),
  },
  {
    title: 'SOURCE - TARGET',
    dataIndex: 'sourceTarget',
    key: '',
    render: (address: any) => (
      <Space>
        <MintAvatar mintAddress={address.tokenA} />
        <Typography.Text>{address.titleA}</Typography.Text>-
        <MintAvatar mintAddress={address.tokenB} />
        <Typography.Text>{address.titleB}</Typography.Text>
      </Space>
    ),
  },
  {
    title: 'AMOUNT',
    key: 'amount',
    dataIndex: 'amount',
  },
  {
    title: 'STATUS',
    key: 'status',
    dataIndex: 'status',
    render: (text: string) => <StatusTag tag={text} />,
  },
  {
    title: 'ACTION',
    key: 'action',
    dataIndex: 'action',
    render: (text: string) => <IonIcon className="action-icon" name={text} />,
  },
]

const DATA = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((key) => ({
  key: key,
  time: '16 Nov, 2021 16:00',
  transactionID: 's239873434973243s239873434973243s239873434973243',
  sourceTarget: {
    tokenA: '5YwUkPdXLoujGkZuo9B4LsLKj3hdkDcfP4derpspifSJ',
    tokenB: '2z6Ci38Cx6PyL3tFrT95vbEeB3izqpoLdxxBkJk2euyj',
    titleA: 'SOL',
    titleB: 'SEN',
  },
  amount: '18.5 SOL',
  status: 'success',
  action: 'open-outline',
}))

const Bridge = () => {
  const [amountRow, setAmountRow] = useState(4)

  const onHandleViewMore = () => setAmountRow(amountRow + 4)
  return (
    <Row gutter={[16, 16]} justify="center">
      <Col span={24}>
        <Table
          columns={COLUMNS}
          dataSource={DATA.slice(0, amountRow)}
          rowClassName={(record, index) => (index % 2 ? 'odd-row' : 'even-row')}
          pagination={false}
          scroll={{ x: 1000, y: 240 }}
        />
      </Col>
      <Col>
        {amountRow < DATA.length && (
          <Button
            onClick={onHandleViewMore}
            icon={<IonIcon name="chevron-down-outline" />}
          >
            View more
          </Button>
        )}
      </Col>
    </Row>
  )
}

export default Bridge

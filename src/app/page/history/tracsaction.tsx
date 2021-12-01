import React, { useEffect, useState } from 'react'

import { Button, Col, Row, Table, Typography } from 'antd'
import { shortenAddress } from 'shared/util'
import StatusTag from './statusTags'
import IonIcon from 'shared/ionicon'

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
        {shortenAddress(text, 3, '...')}
      </Typography.Text>
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
  },
  {
    title: 'STATUS',
    key: 'status',
    dataIndex: 'status',
    render: (text: string) => <StatusTag tag={text} />,
  },
]

const DATA = [
  {
    key: 1,
    time: '16 Nov, 2021 16:00',
    transactionID: 's239873434973243s239873434973243s239873434973243',
    from: 's239873434973243s239873434973243s239873434973243',
    to: 's239873434973243s239873434973243s239873434973243',
    amount: '18.5 SOL',
    status: 'success',
  },
  {
    key: 2,
    time: '16 Nov, 2021 16:00',
    transactionID: 's239873434973243s239873434973243s239873434973243',
    from: 's239873434973243s239873434973243s239873434973243',
    to: 's239873434973243s239873434973243s239873434973243',
    amount: '18.5 SOL',
    status: 'success',
  },
  {
    key: 3,
    time: '16 Nov, 2021 16:00',
    transactionID: 's239873434973243s239873434973243s239873434973243',
    from: 's239873434973243s239873434973243s239873434973243',
    to: 's239873434973243s239873434973243s239873434973243',
    amount: '18.5 SOL',
    status: 'success',
  },
  {
    key: 4,
    time: '16 Nov, 2021 16:00',
    transactionID: 's239873434973243s239873434973243s239873434973243',
    from: 's239873434973243s239873434973243s239873434973243',
    to: 's239873434973243s239873434973243s239873434973243',
    amount: '18.5 SOL',
    status: 'success',
  },
  {
    key: 5,
    time: '16 Nov, 2021 16:00',
    transactionID: 's239873434973243s239873434973243s239873434973243',
    from: 's239873434973243s239873434973243s239873434973243',
    to: 's239873434973243s239873434973243s239873434973243',
    amount: '18.5 SOL',
    status: 'success',
  },
]

const DATA_LENGHT = DATA.length

const DISPLAY_NONE = {
  display: 'none',
}

const Transaction = () => {
  const [amountRow, setAmountRow] = useState(4)
  const [isDisplayNone, setIsDisplayNone] = useState(false)

  useEffect(() => {
    setIsDisplayNone(amountRow >= DATA_LENGHT)
  }, [amountRow])

  const onHanldeViewMore = () => {
    if (amountRow < DATA_LENGHT) {
      setAmountRow(amountRow + 4)
    }
  }

  return (
    <Row gutter={[16, 16]} justify="center">
      <Col span={24}>
        <Table
          columns={COLUMNS}
          dataSource={DATA.slice(0, amountRow)}
          rowClassName={(record, index) =>
            index % 2 === 0 ? 'even-row' : 'odd-row'
          }
          pagination={false}
          scroll={{ x: 1000, y: 240 }}
        />
      </Col>
      <Col>
        <Button
          onClick={() => onHanldeViewMore()}
          icon={<IonIcon name="chevron-down-outline" />}
          style={isDisplayNone ? DISPLAY_NONE : {}}
        >
          View more
        </Button>
      </Col>
    </Row>
  )
}

export default Transaction

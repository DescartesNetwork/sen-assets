import React, { useEffect, useState } from 'react'

import { Button, Col, Row, Space, Table, Typography } from 'antd'
import { shortenAddress } from 'shared/util'
import MintAvatar from 'app/shared/components/mintAvatar'
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

const DATA = [
  {
    key: 1,
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
  },
  {
    key: 2,
    time: '16 Nov, 2021 16:00',
    transactionID: 's2398734...34973243',
    sourceTarget: {
      tokenA: '2z6Ci38Cx6PyL3tFrT95vbEeB3izqpoLdxxBkJk2euyj',
      tokenB: '2z6Ci38Cx6PyL3tFrT95vbEeB3izqpoLdxxBkJk2euyj',
      titleA: 'SOL',
      titleB: 'SEN',
    },
    amount: '18.5 SOL',
    status: 'pending',
    action: 'open-outline',
  },
  {
    key: 3,
    time: '16 Nov, 2021 16:00',
    transactionID: 's2398734...34973243',
    sourceTarget: {
      tokenA: '27hdcZv7RtuMp75vupThR3T4KLsL61t476eosMdoec4c',
      tokenB: '2z6Ci38Cx6PyL3tFrT95vbEeB3izqpoLdxxBkJk2euyj',
      titleA: 'SOL',
      titleB: 'SEN',
    },
    amount: '18.5 SOL',
    status: 'pending',
    action: 'open-outline',
  },
  {
    key: 4,
    time: '16 Nov, 2021 16:00',
    transactionID: 's2398734...34973243',
    sourceTarget: {
      tokenA: '27hdcZv7RtuMp75vupThR3T4KLsL61t476eosMdoec4c',
      tokenB: '2z6Ci38Cx6PyL3tFrT95vbEeB3izqpoLdxxBkJk2euyj',
      titleA: 'SOL',
      titleB: 'SEN',
    },
    amount: '18.5 SOL',
    status: 'error',
    action: 'open-outline',
  },
  {
    key: 5,
    time: '16 Nov, 2021 16:00',
    transactionID: 's2398734...34973243',
    sourceTarget: {
      tokenA: '27hdcZv7RtuMp75vupThR3T4KLsL61t476eosMdoec4c',
      tokenB: '2z6Ci38Cx6PyL3tFrT95vbEeB3izqpoLdxxBkJk2euyj',
      titleA: 'SOL',
      titleB: 'SEN',
    },
    amount: '18.5 SOL',
    status: 'error',
    action: 'open-outline',
  },
  {
    key: 6,
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
  },
  {
    key: 7,
    time: '16 Nov, 2021 16:00',
    transactionID: 's2398734...34973243',
    sourceTarget: {
      tokenA: '2z6Ci38Cx6PyL3tFrT95vbEeB3izqpoLdxxBkJk2euyj',
      tokenB: '2z6Ci38Cx6PyL3tFrT95vbEeB3izqpoLdxxBkJk2euyj',
      titleA: 'SOL',
      titleB: 'SEN',
    },
    amount: '18.5 SOL',
    status: 'pending',
    action: 'open-outline',
  },
  {
    key: 8,
    time: '16 Nov, 2021 16:00',
    transactionID: 's2398734...34973243',
    sourceTarget: {
      tokenA: '27hdcZv7RtuMp75vupThR3T4KLsL61t476eosMdoec4c',
      tokenB: '2z6Ci38Cx6PyL3tFrT95vbEeB3izqpoLdxxBkJk2euyj',
      titleA: 'SOL',
      titleB: 'SEN',
    },
    amount: '18.5 SOL',
    status: 'pending',
    action: 'open-outline',
  },
  {
    key: 9,
    time: '16 Nov, 2021 16:00',
    transactionID: 's2398734...34973243',
    sourceTarget: {
      tokenA: '27hdcZv7RtuMp75vupThR3T4KLsL61t476eosMdoec4c',
      tokenB: '2z6Ci38Cx6PyL3tFrT95vbEeB3izqpoLdxxBkJk2euyj',
      titleA: 'SOL',
      titleB: 'SEN',
    },
    amount: '18.5 SOL',
    status: 'error',
    action: 'open-outline',
  },
  {
    key: 10,
    time: '16 Nov, 2021 16:00',
    transactionID: 's2398734...34973243',
    sourceTarget: {
      tokenA: '27hdcZv7RtuMp75vupThR3T4KLsL61t476eosMdoec4c',
      tokenB: '2z6Ci38Cx6PyL3tFrT95vbEeB3izqpoLdxxBkJk2euyj',
      titleA: 'SOL',
      titleB: 'SEN',
    },
    amount: '18.5 SOL',
    status: 'error',
    action: 'open-outline',
  },
]

const DATA_LENGHT = DATA.length

const DISPLAY_NONE = {
  display: 'none',
}

const Bridge = () => {
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
    <Row gutter={[16, 16]}>
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
      <Col span={24} style={{ textAlign: 'center' }}>
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

export default Bridge

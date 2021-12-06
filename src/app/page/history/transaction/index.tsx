import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Button, Col, Row, Table } from 'antd'
import IonIcon from 'shared/ionicon'

import { AppDispatch, AppState } from 'app/model'
import { fetchTransactionHistory } from 'app/model/history.controller'
import { useWallet } from 'senhub/providers'
import { TRANSACTION_COLUMNS } from './column'

const ROW_PER_PAGE = 4
const Transaction = () => {
  const [amountRow, setAmountRow] = useState(ROW_PER_PAGE)
  const dispatch = useDispatch<AppDispatch>()
  const {
    wallet: { address },
  } = useWallet()
  const { transaction } = useSelector((state: AppState) => state.history)
  const DATA_LENGHT = transaction.length

  useEffect(() => {
    dispatch(fetchTransactionHistory({ programId: address })).unwrap()
  }, [dispatch, address])

  const onHanldeViewMore = () => setAmountRow(amountRow + ROW_PER_PAGE)

  return (
    <Row gutter={[16, 16]} justify="center">
      <Col span={24}>
        <Table
          columns={TRANSACTION_COLUMNS}
          dataSource={transaction.slice(0, amountRow)}
          rowClassName={(record, index) =>
            index % 2 === 0 ? 'even-row' : 'odd-row'
          }
          pagination={false}
          scroll={{ x: 1000 }}
          loading={DATA_LENGHT === 0}
        />
      </Col>
      <Col>
        {
          <Button
            onClick={() => onHanldeViewMore()}
            icon={<IonIcon name="chevron-down-outline" />}
            disabled={amountRow >= DATA_LENGHT}
          >
            View more
          </Button>
        }
      </Col>
    </Row>
  )
}

export default Transaction

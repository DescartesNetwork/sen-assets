import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Button, Col, Row, Table } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

import { AppDispatch, AppState } from 'app/model'
import { fetchTransactionHistory } from 'app/model/history.controller'
import { TRANSACTION_COLUMNS } from './column'

const ROW_PER_PAGE = 4

const Transaction = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [amountRow, setAmountRow] = useState(ROW_PER_PAGE)
  const [isLoading, setIsLoading] = useState(false)
  const {
    history: { transaction },
    account: { accountSelected },
  } = useSelector((state: AppState) => state)

  const fetchHistory = useCallback(async () => {
    if (!accountSelected) return
    try {
      setIsLoading(true)
      await dispatch(
        fetchTransactionHistory({
          accountAddress: accountSelected,
        }),
      )
    } catch (er) {
      console.error(er)
    } finally {
      setIsLoading(false)
    }
  }, [dispatch, accountSelected])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  const onHandleViewMore = () => {
    setAmountRow(amountRow + ROW_PER_PAGE)
  }

  return (
    <Row gutter={[16, 16]} justify="center">
      <Col span={24}>
        <Table
          className="scrollbar"
          columns={TRANSACTION_COLUMNS}
          dataSource={transaction.slice(0, amountRow)}
          rowClassName={(record, index) => (index % 2 ? 'odd-row' : 'even-row')}
          pagination={false}
          scroll={{ x: 1000 }}
          loading={isLoading}
        />
      </Col>
      <Col>
        <Button
          onClick={onHandleViewMore}
          type="text"
          icon={<IonIcon name="chevron-down-outline" />}
          disabled={amountRow >= transaction.length}
        >
          View more
        </Button>
      </Col>
    </Row>
  )
}

export default Transaction

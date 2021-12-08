import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Button, Col, Row, Table } from 'antd'
import IonIcon from 'shared/ionicon'

import { AppDispatch, AppState } from 'app/model'
import { fetchTransactionHistory } from 'app/model/history.controller'
import { TRANSACTION_COLUMNS } from './column'

const ROW_PER_PAGE = 4
const LIMIT_IN_STORE = 8

const Transaction = () => {
  const [amountRow, setAmountRow] = useState(ROW_PER_PAGE)
  const [isLoading, setIsLoading] = useState(true)

  const dispatch = useDispatch<AppDispatch>()
  const { transaction } = useSelector((state: AppState) => state.history)
  const { accountSelected } = useSelector((state: AppState) => state.account)

  const fetchHistory = useCallback(async () => {
    if (!accountSelected) return
    await dispatch(
      fetchTransactionHistory({
        accountAddress: accountSelected,
        isLoadMore: false,
      }),
    )
    setIsLoading(false)
  }, [dispatch, accountSelected])

  useEffect(() => {
    fetchHistory()
    return () => {
      setIsLoading(true)
    }
  }, [fetchHistory])

  const onHandleViewMore = () => {
    const currentTransactionDataLength = transaction.slice(0, amountRow).length
    if (transaction.length - currentTransactionDataLength <= LIMIT_IN_STORE) {
      const lastSignature = transaction[transaction.length - 1].transactionId
      dispatch(
        fetchTransactionHistory({
          accountAddress: accountSelected,
          lastSignature,
          isLoadMore: true,
        }),
      )
    }
    setAmountRow(amountRow + ROW_PER_PAGE)
  }

  return (
    <Row gutter={[16, 16]} justify="center">
      <Col span={24}>
        <Table
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

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { account } from '@senswap/sen-js'

import { Button, Col, Row, Table } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

import { WORMHOLE_COLUMNS } from './column'
import { AppDispatch, AppState } from 'model'
import { fetchWohHistory } from 'model/wohHistory.controller'
import { notifyError } from 'helper'
import { TransferState } from 'constant/types/wormhole'

const ROW_PER_PAGE = 4

const WormholeHistory = () => {
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const {
    wohHistory,
    wormhole: { sourceWalletAddress },
  } = useSelector((state: AppState) => state)

  const [amountRow, setAmountRow] = useState(ROW_PER_PAGE)
  const [sortedHistory, setSortedHistory] = useState<TransferState[]>()

  /* toLowerCase sourceWalletAddress to avoid unnecessary rerenders caused by sensitive case */
  const nomalizeSourceAddr = useMemo(() => {
    if (!account.isAddress(sourceWalletAddress)) {
      //@ts-ignore
      return sourceWalletAddress?.toLowerCase()
    }
    return sourceWalletAddress
  }, [sourceWalletAddress])

  const fetchBridgeHistory = useCallback(async () => {
    if (!nomalizeSourceAddr) return
    try {
      setIsLoading(true)
      setAmountRow(ROW_PER_PAGE)
      await dispatch(
        fetchWohHistory({
          address: nomalizeSourceAddr,
          isFirstFetch: true,
        }),
      ).unwrap()
    } catch (er) {
      notifyError(er)
    } finally {
      setIsLoading(false)
    }
  }, [dispatch, nomalizeSourceAddr])

  useEffect(() => {
    fetchBridgeHistory()
  }, [fetchBridgeHistory])

  const onHandleViewMore = async () => {
    setAmountRow(amountRow + ROW_PER_PAGE)
  }

  useEffect(() => {
    const sortedHistory = Object.values(wohHistory).sort(function (a, b) {
      return b.context.time - a.context.time
    })
    setSortedHistory(sortedHistory)
  }, [wohHistory])

  return (
    <Row gutter={[16, 16]} justify="center">
      <Col span={24}>
        <Table
          columns={WORMHOLE_COLUMNS}
          dataSource={sortedHistory?.slice(0, amountRow)}
          rowClassName={(record, index) => (index % 2 ? 'odd-row' : 'even-row')}
          pagination={false}
          // scroll={{ x: 1000 }}
          rowKey={(record) => record.context.id}
          loading={isLoading}
        />
      </Col>
      <Col>
        <Button
          disabled={
            isLoading === true ||
            !sourceWalletAddress ||
            amountRow >= Object.keys(wohHistory).length
          }
          onClick={onHandleViewMore}
          type="text"
          icon={<IonIcon name="chevron-down-outline" />}
        >
          View more
        </Button>
      </Col>
    </Row>
  )
}

export default WormholeHistory

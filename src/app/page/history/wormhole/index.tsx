import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Button, Col, Row, Table } from 'antd'
import IonIcon from 'shared/antd/ionicon'

import { WORMHOLE_COLUMNS } from './column'
import { AppDispatch, AppState } from 'app/model'
import { fetchWohHistory } from 'app/model/wohHistory.controller'
import { notifyError } from 'app/helper'
import { RawEtherTransaction } from 'app/constant/types/wormhole'

const ROW_PER_PAGE = 4

const WormholeHistory = () => {
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const {
    wohHistory,
    wormhole: { sourceWalletAddress },
  } = useSelector((state: AppState) => state)

  const [amountRow, setAmountRow] = useState(ROW_PER_PAGE)
  const [fromBlk, setFromBlk] = useState<number>()
  const [leftTrxInBlk, setLeftTrxInBlk] = useState<RawEtherTransaction[]>()
  const [fetchedDays, setFetchedDays] = useState<number>(0)

  const fetchBridgeHistory = useCallback(async () => {
    if (!sourceWalletAddress) return
    try {
      setIsLoading(true)
      const { fromBlock, leftTransaction, count } = await dispatch(
        fetchWohHistory({ address: sourceWalletAddress }),
      ).unwrap()
      setFromBlk(fromBlock)
      setLeftTrxInBlk(leftTransaction)
      setFetchedDays(count)
    } catch (er) {
      notifyError(er)
    } finally {
      setIsLoading(false)
    }
  }, [dispatch, sourceWalletAddress])

  useEffect(() => {
    fetchBridgeHistory()
  }, [fetchBridgeHistory])

  const onHandleViewMore = async () => {
    setAmountRow(amountRow + ROW_PER_PAGE)
    try {
      // setIsLoading(true)
      const { fromBlock, leftTransaction, count } = await dispatch(
        fetchWohHistory({
          address: sourceWalletAddress,
          fromBLK: fromBlk,
          leftTrx: leftTrxInBlk,
          fetchedDays: fetchedDays,
        }),
      ).unwrap()
      setFromBlk(fromBlock)
      setLeftTrxInBlk(leftTransaction)
      setFetchedDays(count)
    } catch (er) {
      notifyError(er)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Row gutter={[16, 16]} justify="center">
      <Col span={24}>
        <Table
          columns={WORMHOLE_COLUMNS}
          dataSource={Object.values(wohHistory).slice(0, amountRow)}
          rowClassName={(record, index) => (index % 2 ? 'odd-row' : 'even-row')}
          pagination={false}
          scroll={{ x: 1000 }}
          rowKey={(record) => record.context.id}
          loading={isLoading}
        />
      </Col>
      <Col>
        <Button
          disabled={fetchedDays >= 30 || isLoading === true}
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

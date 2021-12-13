import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Button, Col, Row, Table } from 'antd'
import IonIcon from 'shared/antd/ionicon'

import { WORMHOLE_COLUMNS } from './column'
import { AppDispatch, AppState } from 'app/model'
import { fetchWohHistory } from 'app/model/wohHistory.controller'
import { notifyError } from 'app/helper'

const ROW_PER_PAGE = 4

const WormholeHistory = () => {
  const [isLoading, setIsLoading] = useState(true)
  const dispatch = useDispatch<AppDispatch>()
  const {
    wohHistory,
    wormhole: { sourceWalletAddress },
  } = useSelector((state: AppState) => state)

  const [amountRow, setAmountRow] = useState(ROW_PER_PAGE)

  const fetchBridgeHistory = useCallback(async () => {
    if (!sourceWalletAddress) return
    try {
      await dispatch(fetchWohHistory({ address: sourceWalletAddress })).unwrap()
    } catch (er) {
      notifyError(er)
      console.log('er', er)
    } finally {
      setIsLoading(false)
    }
  }, [dispatch, sourceWalletAddress])

  useEffect(() => {
    fetchBridgeHistory()
    return () => {
      setIsLoading(true)
    }
  }, [fetchBridgeHistory])

  const onHandleViewMore = () => setAmountRow(amountRow + ROW_PER_PAGE)

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
          disabled={amountRow >= Object.keys(wohHistory).length}
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

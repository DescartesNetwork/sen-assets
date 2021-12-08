import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Button, Col, Row, Table } from 'antd'
import IonIcon from 'shared/ionicon'

import { WORMHOLE_COLUMNS } from './column'
import { AppState } from 'app/model'
import { fetchWormholeHistory } from 'app/model/history.controller'
import { fetchTransactionsAAddress } from '../../../lib/wormhole/helper'

const ROW_PER_PAGE = 4

const WormholeHistory = () => {
  const dispatch = useDispatch()
  const { wormhole } = useSelector((state: AppState) => state.history)
  const [amountRow, setAmountRow] = useState(ROW_PER_PAGE)

  useEffect(() => {
    dispatch(fetchWormholeHistory())
  }, [dispatch])

  const onHandleViewMore = () => setAmountRow(amountRow + ROW_PER_PAGE)
  console.log(wormhole, 'slslskdkdkdk')

  return (
    <Row gutter={[16, 16]} justify="center">
      <Col span={24}>
        <Table
          columns={WORMHOLE_COLUMNS}
          dataSource={wormhole.slice(0, amountRow)}
          rowClassName={(record, index) => (index % 2 ? 'odd-row' : 'even-row')}
          pagination={false}
          scroll={{ x: 1000 }}
          rowKey={(record) => record.context.id}
        />
      </Col>
      <Col>
        <Button
          disabled={amountRow >= wormhole.length}
          onClick={onHandleViewMore}
          type="text"
          icon={<IonIcon name="chevron-down-outline" />}
        >
          View more
        </Button>
      </Col>
      <Col>
        <Button
          onClick={()=>fetchTransactionsAAddress('0xf27F3863177A72957D409054c3f48a5fe35dF84B', 'goerli')}
          icon={<IonIcon name="chevron-down-outline" />}
        >
          Fetch
        </Button>
      </Col>
    </Row>
  )
}

export default WormholeHistory

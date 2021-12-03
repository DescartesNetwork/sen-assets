import { useState } from 'react'
import { useSelector } from 'react-redux'

import { Button, Col, Row, Table } from 'antd'
import IonIcon from 'shared/ionicon'

import { WORMHOLE_COLUMNS } from './column'
import { AppState } from 'app/model'

const Bridge = () => {
  const { wormhole } = useSelector((state: AppState) => state.history)
  const [amountRow, setAmountRow] = useState(4)

  const onHandleViewMore = () => setAmountRow(amountRow + 4)
  return (
    <Row gutter={[16, 16]} justify="center">
      <Col span={24}>
        <Table
          columns={WORMHOLE_COLUMNS}
          dataSource={wormhole.slice(0, amountRow)}
          rowClassName={(record, index) => (index % 2 ? 'odd-row' : 'even-row')}
          pagination={false}
          scroll={{ x: 1000, y: 240 }}
        />
      </Col>
      <Col>
        {amountRow < wormhole.length && (
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

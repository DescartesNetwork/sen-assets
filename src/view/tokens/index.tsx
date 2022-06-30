import { Row, Col } from 'antd'

import ListAccount from 'view/tokens/listAccount'

const Tokens = () => {
  return (
    <Row justify="center" align="middle">
      {/* Body + Search */}
      <Col span={24}>
        <ListAccount />
      </Col>
    </Row>
  )
}

export default Tokens

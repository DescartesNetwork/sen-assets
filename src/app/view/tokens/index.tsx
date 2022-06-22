import { Row, Col } from 'antd'

import ListAccount from 'app/view/tokens/listAccount'

const Tokens = () => {
  return (
    <Row gutter={[24, 24]} justify="center" align="middle">
      {/* Body + Search */}
      <Col span={24}>
        <ListAccount />
      </Col>
    </Row>
  )
}

export default Tokens

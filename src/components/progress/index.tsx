import { Col, Row } from 'antd'
import './index.css'

export const Progress = ({ percent = 100 }: { percent?: number }) => {
  return (
    <Row>
      <Col className="progress" span={24}>
        <span className="progress-bar" style={{ width: `${percent}%` }}></span>
      </Col>
    </Row>
  )
}

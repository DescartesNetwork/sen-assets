import { useCallback, useEffect, useState } from 'react'

import { Button, Checkbox, Col, Progress, Row } from 'antd'

const TIME_INTERVAL = 50
const PERCENTAGE = 100
const PERCENT_PER_SECOND = 1

const ConfirmAction = ({
  onClose = () => {},
}: {
  onClose?: (visible: boolean) => void
}) => {
  const [acceptable, setAcceptable] = useState(false)
  const [percent, setPercent] = useState(0)
  const [loading, setLoading] = useState(false)

  const closeModal = useCallback(() => {
    setLoading(false)
    setAcceptable(false)
    setPercent(0)
    onClose(false)
  }, [onClose])

  // set loading percentage
  useEffect(() => {
    if (!loading) return
    let count = percent
    const interval = setInterval(() => {
      count += PERCENT_PER_SECOND
      setPercent(count)
    }, TIME_INTERVAL)
    if (percent >= PERCENTAGE) closeModal()
    return () => clearInterval(interval)
  }, [closeModal, loading, percent])

  // loading button
  if (loading)
    return (
      <Row gutter={[8, 8]} justify="center">
        <Col span={24}>
          <Progress percent={percent} showInfo={false} />
        </Col>
        <Col span={24}>
          <Button loading type="primary" block>
            Loading
          </Button>
        </Col>
        <Col>
          <Button type="text" onClick={closeModal}>
            Close
          </Button>
        </Col>
      </Row>
    )

  // confirm button
  return (
    <Row gutter={[8, 8]} justify="center">
      <Col span={24}>
        <Checkbox
          checked={acceptable}
          onChange={() => setAcceptable(!acceptable)}
        >
          I have read and understood
        </Checkbox>
      </Col>
      <Col span={24}>
        <Button
          onClick={() => setLoading(true)}
          type="primary"
          block
          disabled={!acceptable}
        >
          Approve {10} token
        </Button>
      </Col>
      <Col>
        <Button type="text" onClick={closeModal}>
          Cancle
        </Button>
      </Col>
    </Row>
  )
}

export default ConfirmAction

import { Col, Row, Typography } from 'antd'
import InputCopy from 'app/components/inputCopy'
import QRcode from 'qrcode.react'

const Receive = ({ accountAddr }: { accountAddr: string }) => {
  return (
    <Row justify="center" gutter={[16, 16]}>
      <Col style={{ background: '#f4f4f5', paddingTop: 8 }}>
        <QRcode
          value={accountAddr}
          size={84}
          bgColor="#ffffff"
          fgColor="#1f1f1f"
        />
      </Col>
      <Col span={24}>
        <Row gutter={[8, 8]}>
          <Col span={24}>
            <Typography.Text>Wallet address</Typography.Text>
          </Col>
          <Col span={24}>
            <InputCopy size="large" value={accountAddr} />
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default Receive

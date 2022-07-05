import { Col, Row, Tooltip, Typography } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import { MintAvatar, MintSymbol, MintName } from 'shared/antd/mint'

type LogoItemProps = {
  mint: string
}

const LogoItem = ({ mint }: LogoItemProps) => {
  return (
    <Row gutter={[16, 16]} wrap={false} align="middle">
      <Col>
        <MintAvatar mintAddress={mint} size={32} />
      </Col>
      <Col flex="auto">
        <Row>
          <Col span={24}>
            <Typography.Title level={4} ellipsis={{ tooltip: true }}>
              <MintSymbol mintAddress={mint} />
              <Tooltip title={`Mint Address: ${mint}`}>
                <IonIcon
                  name="information-circle-outline"
                  style={{ fontSize: 14, cursor: 'pointer', paddingLeft: 10 }}
                />
              </Tooltip>
            </Typography.Title>
          </Col>
          <Col span={24}>
            <Typography.Text
              type="secondary"
              className="caption"
              ellipsis={{ tooltip: true }}
            >
              <MintName mintAddress={mint} />
            </Typography.Text>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default LogoItem

import { Button, Col, Row, Select, Space, Typography } from 'antd'
import IonIcon from 'shared/ionicon'

import { MintAvatar } from 'app/shared/components/mint'
import Solana from './solana'
import Ethereum from './ethereum'
import { useAccount, useMint } from 'senhub/providers'

const WalletConnections = ({
  value = 'Select',
  onChange = () => {},
}: {
  value?: string
  onChange?: (mintAddress: string) => void
}) => {
  return (
    <Row gutter={[16, 16]}>
      <Col flex="auto">
        <Select
          onChange={onChange}
          value={value}
          bordered={false}
          suffixIcon={<IonIcon name="chevron-down-outline" />}
          size="large"
          style={{ marginLeft: -4 }}
          className="custom-selector"
          dropdownStyle={{ lineHeight: 'nomarl' }}
        >
          <Select.Option value={'Select'}>
            <Space>
              <MintAvatar
                size={32}
                mintAddress={'Select'}
                icon={<IonIcon name="help-outline" />}
              />
              <Space direction="vertical" size={0}>
                <Typography.Text style={{ fontWeight: 600 }}>
                  Select
                </Typography.Text>
              </Space>
            </Space>
          </Select.Option>
          <Select.Option value={'solana'}>
            <Solana />
          </Select.Option>
          <Select.Option value={'ethereum'}>
            <Ethereum />
          </Select.Option>
        </Select>
      </Col>
      <Col>
        <Button size="small">Connect</Button>
      </Col>
    </Row>
  )
}

export default WalletConnections

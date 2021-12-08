import {
  Avatar,
  Button,
  Col,
  Row,
  Select,
  Space,
  Tooltip,
  Typography,
} from 'antd'
import IonIcon from 'shared/ionicon'

import { WORMHOLE_NETWORK } from 'app/lib/wormhole/constant/wormhole'
import { shortenAddress } from 'shared/util'
import { ChainId } from '@certusone/wormhole-sdk'

export const NetworkConnect = ({
  connected,
  installed,
  onConnect = () => {},
  onDisconnect = () => {},
}: {
  connected: boolean
  installed: boolean
  onConnect?: () => void
  onDisconnect?: () => void
}) => {
  if (connected)
    return (
      <Button size="small" onClick={onDisconnect}>
        Disconnect
      </Button>
    )

  return (
    <Tooltip title={installed ? '' : 'Install Metamask please'}>
      <Button
        size="small"
        onClick={onConnect}
        type="primary"
        disabled={!installed}
      >
        Connect
      </Button>
    </Tooltip>
  )
}

const Network = ({
  chainId,
  address,
  onChange = () => {},
}: {
  chainId: ChainId
  address: string
  onChange?: (chainId: ChainId) => void
}) => {
  return (
    <Row>
      <Col span={24}>
        <Select
          onChange={(value) => onChange(Number(value) as ChainId)}
          value={String(chainId)}
          bordered={false}
          suffixIcon={<IonIcon name="chevron-down-outline" />}
          size="large"
          style={{ marginLeft: -4 }}
          className="custom-selector"
          dropdownStyle={{ lineHeight: 'normal' }}
          disabled
        >
          {WORMHOLE_NETWORK.map((network) => (
            <Select.Option
              value={String(network.chainID)}
              key={network.chainID}
            >
              <Space>
                <Avatar
                  src={network.logo}
                  size={32}
                  style={{ backgroundColor: '#2D3355', border: 'none' }}
                />
                <Space direction="vertical" size={0}>
                  <Typography.Text style={{ fontWeight: 600 }}>
                    {network.name}
                  </Typography.Text>
                  {address && (
                    <Typography.Text style={{ fontSize: 12 }}>
                      {shortenAddress(address)}
                    </Typography.Text>
                  )}
                </Space>
              </Space>
            </Select.Option>
          ))}
        </Select>
      </Col>
    </Row>
  )
}

export default Network

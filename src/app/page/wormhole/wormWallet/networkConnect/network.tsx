import { Avatar, Button, Col, Row, Select, Space, Typography } from 'antd'
import IonIcon from 'shared/ionicon'

import { WORMHOLE_NETWORK } from 'app/lib/wormhole/config'
import { shortenAddress } from 'shared/util'
import { useWallet } from 'senhub/providers'
import { ChainId } from '@certusone/wormhole-sdk'

const NetworkConnect = ({
  address,
  onConnect,
  onDisconnect,
}: {
  address: string
  onConnect: () => void
  onDisconnect: () => void
}) => {
  const {
    wallet: { address: walletAddress },
  } = useWallet()
  if (!address)
    return (
      <Button size="small" onClick={onConnect}>
        Connect
      </Button>
    )

  if (address === walletAddress)
    return (
      <Button size="small" disabled>
        Senhub wallet
      </Button>
    )

  return (
    <Button size="small" onClick={onDisconnect}>
      Disconnect
    </Button>
  )
}

const Network = ({
  chainId,
  address,
  onChange = () => {},
  onConnect = () => {},
  onDisconnect = () => {},
}: {
  chainId: ChainId
  address: string
  onChange?: (chainId: ChainId) => void
  onConnect?: () => void
  onDisconnect?: () => void
}) => {
  return (
    <Row gutter={[16, 16]}>
      <Col flex="auto">
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
            <Select.Option value={String(network.chainID)} key={network.chainID}>
              <Space>
                <Avatar
                  src={network.icon}
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
      <Col>
        <NetworkConnect
          address={address}
          onConnect={onConnect}
          onDisconnect={onDisconnect}
        />
      </Col>
    </Row>
  )
}

export default Network

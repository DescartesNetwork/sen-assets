import { ChainId } from '@certusone/wormhole-sdk'

import {
  Avatar,
  Button,
  Col,
  Row,
  Select,
  Space,
  Typography,
  Popover,
  Card,
} from 'antd'
import IonIcon from 'shared/antd/ionicon'

import { WORMHOLE_NETWORK } from 'app/lib/wormhole/constant/wormhole'
import { shortenAddress } from 'shared/util'
import METAMASK from 'app/static/images/metamask.png'
import COIN98 from 'app/static/images/coin98.png'
import MetamaskWallet from 'app/lib/etherWallet/metamask'
import Coin98Wallet from 'app/lib/etherWallet/coin98'

export type WalletOptionProps = {
  onClick?: () => void
  src: string
  title: string
}

export const WalletOption = ({
  onClick = () => {},
  src,
  title,
}: WalletOptionProps) => {
  return (
    <Card bodyStyle={{ padding: 16, cursor: 'pointer' }} onClick={onClick}>
      <Row gutter={[16, 16]} wrap={false} align="middle">
        <Col>
          <Avatar src={src} />
        </Col>
        <Col flex="auto">
          <Typography.Text>{title}</Typography.Text>
        </Col>
        <Col>
          <Button type="text" icon={<IonIcon name="arrow-forward-outline" />} />
        </Col>
      </Row>
    </Card>
  )
}

export const NetworkConnect = ({
  connected,
  onConnect = () => {},
  onDisconnect = () => {},
}: {
  connected: boolean
  onConnect?: (type?: string) => void
  onDisconnect?: () => void
}) => {
  if (connected)
    return (
      <Button size="small" onClick={onDisconnect}>
        Disconnect
      </Button>
    )

  return (
    <Row>
      <Popover
        content={
          <Row gutter={[16, 16]} style={{ maxWidth: 256 }}>
            <Col span={24}>
              <Typography.Title level={5}>Ethereum Connection</Typography.Title>
            </Col>
            <Col span={24}>
              <WalletOption
                onClick={() => onConnect(MetamaskWallet.walletType)}
                src={METAMASK}
                title="Metamask"
              />
            </Col>
            <Col span={24}>
              <WalletOption
                onClick={() => onConnect(Coin98Wallet.walletType)}
                src={COIN98}
                title="Coin98"
              />
            </Col>
          </Row>
        }
        trigger="click"
      >
        <Button size="small" type="primary">
          Connect
        </Button>
      </Popover>
    </Row>
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
                  {address && network.chainID === chainId && (
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

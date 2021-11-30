import { Space, Typography } from 'antd'
import { MintAvatar } from 'app/shared/components/mint'

const Ethereum = () => {
  const isConnect = false

  return (
    <Space>
      <MintAvatar mintAddress={''} size={32} />
      <Space direction="vertical" size={0}>
        <Typography.Text style={{ fontWeight: 600 }}>Ethereum</Typography.Text>
        {isConnect && (
          <Typography.Text style={{ fontSize: 12 }}>
            wallet address
          </Typography.Text>
        )}
      </Space>
    </Space>
  )
}

export default Ethereum

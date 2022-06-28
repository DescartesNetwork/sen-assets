import { Space, Typography } from 'antd'
import { MintAvatar, MintSymbol, MintName } from 'shared/antd/mint'

type LogoItemProps = {
  mint: string
}

const LogoItem = ({ mint }: LogoItemProps) => {
  return (
    <Space>
      <MintAvatar mintAddress={mint} size={32} />
      <Space direction="vertical" size={0}>
        <Typography.Title level={4}>
          <MintSymbol mintAddress={mint} />
        </Typography.Title>
        <Typography.Text type="secondary" className="caption">
          <MintName mintAddress={mint} />
        </Typography.Text>
      </Space>
    </Space>
  )
}

export default LogoItem

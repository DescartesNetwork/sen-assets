import { Space, Typography } from 'antd'
import { MintAvatar, MintSymbol, MintName } from 'shared/antd/mint'

type LogoItemProps = {
  mint: string
}

const LogoItem = ({ mint }: LogoItemProps) => {
  return (
    <Space>
      <MintAvatar mintAddress={mint} size={24} />
      <Typography.Text>
        <MintSymbol mintAddress={mint} />
      </Typography.Text>
      <Typography.Text type="secondary" className="caption">
        (<MintName mintAddress={mint} />)
      </Typography.Text>
    </Space>
  )
}

export default LogoItem

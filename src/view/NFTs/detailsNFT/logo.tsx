import { Space, Typography } from 'antd'
import Address from '../cardNFT/address'

type LogoProps = {
  name?: string
  mintAddress: string
}

const Logo = ({ name = '', mintAddress }: LogoProps) => {
  return (
    <Space direction="vertical">
      <Typography.Text type="danger" ellipsis={{ tooltip: true }}>
        {name}
      </Typography.Text>
      <Address address={mintAddress} />
    </Space>
  )
}

export default Logo

import { Space, Tooltip, Typography } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
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
          <MintSymbol mintAddress={mint} />{' '}
          <Tooltip title={`Mint Address: ${mint}`}>
            <IonIcon
              name="information-circle-outline"
              style={{ fontSize: 14 }}
            />
          </Tooltip>
        </Typography.Title>
        <Typography.Text type="secondary" className="caption">
          <MintName mintAddress={mint} />
        </Typography.Text>
      </Space>
    </Space>
  )
}

export default LogoItem

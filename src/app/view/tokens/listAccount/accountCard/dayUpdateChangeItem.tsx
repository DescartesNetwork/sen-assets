import { Space, Typography } from 'antd'
import { PriceChange, PriceIndicator } from 'app/components/price'

type DayUpdateChangeItemProps = {
  mint: string
}

const DayUpdateChangeItem = ({ mint }: DayUpdateChangeItemProps) => {
  return (
    <Space direction="vertical" size={0} style={{ width: '100%' }}>
      <Typography.Text type="secondary" className="caption">
        24h Change
      </Typography.Text>
      <Typography.Text>
        <Space size={2}>
          <PriceIndicator mintAddress={mint} colorized />
          <PriceChange mintAddress={mint} colorized />
        </Space>
      </Typography.Text>
    </Space>
  )
}

export default DayUpdateChangeItem

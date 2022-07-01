import { Space, Typography } from 'antd'
import Price from 'components/price'

type PriceItemProps = {
  mint: string
}

const PriceItem = ({ mint }: PriceItemProps) => {
  return (
    <Space direction="vertical" size={0} style={{ width: '100%' }}>
      <Typography.Text type="secondary" className="caption">
        Price
      </Typography.Text>
      <Typography.Text>
        <Price mintAddress={mint} />
      </Typography.Text>
    </Space>
  )
}

export default PriceItem

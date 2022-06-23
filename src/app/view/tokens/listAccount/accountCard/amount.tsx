import { Space, Typography } from 'antd'
import Balance from 'app/components/balance'

type AmountItemProps = {
  accountAddr: string
}

const AmountItem = ({ accountAddr }: AmountItemProps) => {
  return (
    <Space direction="vertical" size={0} style={{ width: '100%' }}>
      <Typography.Text type="secondary" className="caption">
        Amount
      </Typography.Text>
      <Typography.Text>
        <Balance accountAddr={accountAddr} />
      </Typography.Text>
    </Space>
  )
}

export default AmountItem

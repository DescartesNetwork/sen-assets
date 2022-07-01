import { Space, Typography } from 'antd'
import Balance from 'components/balance'

type ValueItemProps = {
  accountAddr: string
}

const ValueItem = ({ accountAddr }: ValueItemProps) => {
  return (
    <Space direction="vertical" size={0} style={{ width: '100%' }}>
      <Typography.Text className="caption" type="secondary">
        Value
      </Typography.Text>
      <Typography.Text>
        <Balance accountAddr={accountAddr} inUSD autoHidden />
      </Typography.Text>
    </Space>
  )
}

export default ValueItem

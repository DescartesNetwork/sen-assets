import { useAccounts } from '@sentre/senhub'

import { Card, Checkbox, Col, Space } from 'antd'
import { CheckboxChangeEvent } from 'antd/lib/checkbox'
import LogoItem from './logoItem'

type CardTokenProps = {
  accountAddress: string
  onSelect?: (accountAddress: string, isChecked: boolean) => void
  isChecked?: boolean
}

const CardToken = ({
  accountAddress,
  onSelect,
  isChecked = false,
}: CardTokenProps) => {
  const accounts = useAccounts()
  const onChange = (e: CheckboxChangeEvent) => {
    if (onSelect) onSelect(accountAddress, e.target.checked)
  }
  return (
    <Card className="account-item" bodyStyle={{ padding: 12 }}>
      <Space>
        <Col>
          <Checkbox checked={isChecked} onChange={onChange} />
        </Col>
        <Col>
          {/* Token Info */}
          <LogoItem mint={accounts[accountAddress].mint} />
        </Col>
      </Space>
    </Card>
  )
}

export default CardToken

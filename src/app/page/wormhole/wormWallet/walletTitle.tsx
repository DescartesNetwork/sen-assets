import { useState } from 'react'

import { Space, Tooltip, Typography } from 'antd'
import IonIcon from 'shared/ionicon'

const WalletTitle = ({ title, label }: { title: string; label: string }) => {
  const [visible, setVisible] = useState(false)

  return (
    <Tooltip
      title={title}
      visible={visible}
      onVisibleChange={() => setVisible(false)}
    >
      <Space>
        <Typography.Text>{label}</Typography.Text>
        <IonIcon
          name="information-circle-outline"
          onClick={() => setVisible(true)}
          style={{ cursor: 'pointer' }}
        />
      </Space>
    </Tooltip>
  )
}

export default WalletTitle

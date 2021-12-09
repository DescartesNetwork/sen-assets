import { useState } from 'react'

import { Space, Tooltip, Typography } from 'antd'
import IonIcon from 'shared/antd/ionicon'

const WalletTitle = ({ title, label }: { title: string; label: string }) => {
  const [visible, setVisible] = useState(false)

  return (
    <Space>
      <Typography.Text>{label}</Typography.Text>
      <Tooltip
        title={title}
        visible={visible}
        onVisibleChange={() => setVisible(false)}
      >
        <IonIcon
          name="information-circle-outline"
          onClick={() => setVisible(true)}
          style={{ cursor: 'pointer' }}
        />
      </Tooltip>
    </Space>
  )
}

export default WalletTitle

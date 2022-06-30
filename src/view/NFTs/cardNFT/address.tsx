import React, { useState } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'

import { Space, Typography, Tooltip } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import { util } from '@sentre/senhub'

const Address = ({ address }: { address: string }) => {
  const [copied, setCopied] = useState(false)

  const onCopy = async () => {
    setCopied(true)
    await util.asyncWait(1500)
    setCopied(false)
  }

  return (
    <Space>
      <Typography.Text type="secondary" className="t-16">
        {util.shortenAddress(address)}
      </Typography.Text>
      <Tooltip title="Copied" visible={copied}>
        <CopyToClipboard text={address} onCopy={onCopy}>
          <Typography.Text style={{ cursor: 'pointer' }} className="t-16">
            <IonIcon name="copy-outline" />
          </Typography.Text>
        </CopyToClipboard>
      </Tooltip>
    </Space>
  )
}

export default Address

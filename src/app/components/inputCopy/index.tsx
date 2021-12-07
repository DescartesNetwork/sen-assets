import { useState } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'

import { Button, Input, InputProps, Tooltip } from 'antd'
import IonIcon from 'shared/ionicon'

import { asyncWait } from 'shared/util'

const InputCopy = (props: InputProps) => {
  const [copied, setCopied] = useState(false)

  const onCopy = async () => {
    setCopied(true)
    await asyncWait(1500)
    setCopied(false)
  }

  return (
    <Input
      {...props}
      suffix={
        <Tooltip title="Copied" visible={copied}>
          <CopyToClipboard text={String(props.value)} onCopy={onCopy}>
            <Button
              type="text"
              size="small"
              icon={<IonIcon name="copy-outline" />}
            />
          </CopyToClipboard>
        </Tooltip>
      }
    />
  )
}

export default InputCopy

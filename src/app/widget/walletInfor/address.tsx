import { useState } from 'react'

import { Tooltip, Space, Popover } from 'antd'
import QRCode from 'qrcode.react'
import CopyToClipboard from 'react-copy-to-clipboard'
import IconButton from 'app/page/accountAction/header/walletAddress/iconButton'
import Settings from 'app/page/walletAccounts/settings'

import { useWallet } from 'senhub/providers'

const QR = ({ address }: { address: string }) => {
  return (
    <Popover
      placement="bottomLeft"
      color="#ffffff"
      overlayInnerStyle={{ paddingTop: 6 }}
      content={
        <QRCode
          value={address}
          size={140}
          bgColor="#ffffff"
          fgColor="#1f1f1f"
        />
      }
      trigger="click"
      arrowPointAtCenter
    >
      <IconButton color="#212433" name="qr-code-outline" />
    </Popover>
  )
}

const Address = () => {
  const {
    wallet: { address },
  } = useWallet()
  const [copied, setCopied] = useState(false)

  const onCopy = async () => {
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 1500)
  }

  return (
    <Space size={10}>
      <Tooltip title="Copied" visible={copied}>
        <CopyToClipboard text={address} onCopy={onCopy}>
          <IconButton color="#212433" name="copy-outline" onClick={onCopy} />
        </CopyToClipboard>
      </Tooltip>
      <QR address={address} />
      <Settings />
    </Space>
  )
}

export default Address

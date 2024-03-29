import { useState } from 'react'
import { useWalletAddress } from '@sentre/senhub'

import { Tooltip, Space, Typography, Popover } from 'antd'
import { QRCodeCanvas } from 'qrcode.react'
import CopyToClipboard from 'react-copy-to-clipboard'
import IconButton from 'components/iconButton'

import { util } from '@sentre/senhub'

const QR = ({ address }: { address: string }) => {
  return (
    <Popover
      placement="bottomLeft"
      color="#ffffff"
      overlayInnerStyle={{ paddingTop: 6 }}
      content={
        <QRCodeCanvas
          value={address}
          size={140}
          bgColor="#ffffff"
          fgColor="#1f1f1f"
        />
      }
      trigger="click"
      arrowPointAtCenter
    >
      <IconButton name="qr-code-outline" />
    </Popover>
  )
}

const WalletAddress = () => {
  const walletAddress = useWalletAddress()
  const [copied, setCopied] = useState(false)

  const onCopy = async () => {
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 1500)
  }
  return (
    <Space size={10}>
      <Typography.Text
        style={{ color: '#E9E9EB', cursor: 'pointer' }}
        onClick={() => window.open(util.explorer(walletAddress), '_blank')}
      >
        {util.shortenAddress(walletAddress, 3, '...')}
      </Typography.Text>
      <Tooltip title="Copied" open={copied}>
        <CopyToClipboard text={walletAddress} onCopy={onCopy}>
          <IconButton name="copy-outline" onClick={onCopy} />
        </CopyToClipboard>
      </Tooltip>
      <QR address={walletAddress} />
    </Space>
  )
}

export default WalletAddress

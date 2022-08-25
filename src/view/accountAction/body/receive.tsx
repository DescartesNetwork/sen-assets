import { useCallback, useEffect, useState } from 'react'
import { useAccounts, useWalletAddress } from '@sentre/senhub'

import { Col, Row, Space, Switch, Typography } from 'antd'
import InputCopy from 'components/inputCopy'
import QRcode from 'qrcode.react'

const Receive = ({ accountAddr }: { accountAddr: string }) => {
  const accounts = useAccounts()
  const walletAddress = useWalletAddress()
  const [devMode, setDevMode] = useState(false)
  const [addressDisplay, setAddressDisplay] = useState('')

  const getAccountWithMode = useCallback(async () => {
    if (!devMode || accountAddr === walletAddress)
      return setAddressDisplay(walletAddress)

    const splt = window.sentre.splt
    const mint = accounts[accountAddr].mint
    const deriveAddress = await splt.deriveAssociatedAddress(
      walletAddress,
      mint,
    )
    return setAddressDisplay(deriveAddress)
  }, [accountAddr, accounts, devMode, walletAddress])

  useEffect(() => {
    getAccountWithMode()
  }, [getAccountWithMode])

  return (
    <Row justify="center" gutter={[16, 16]}>
      <Col style={{ background: '#f4f4f5', paddingTop: 8 }}>
        <QRcode
          value={addressDisplay}
          size={110}
          bgColor="#ffffff"
          fgColor="#1f1f1f"
        />
      </Col>
      <Col span={24}>
        <Row gutter={[8, 8]}>
          <Col flex="auto">
            <Typography.Text>
              {devMode ? 'Associated account address' : 'Wallet address'}
            </Typography.Text>
          </Col>
          <Col>
            {accountAddr !== walletAddress && (
              <Space>
                <Typography.Text>Developer mode</Typography.Text>
                <Switch size="small" checked={devMode} onChange={setDevMode} />
              </Space>
            )}
          </Col>
          <Col span={24}>
            <InputCopy size="large" value={addressDisplay} />
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default Receive

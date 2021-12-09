import { useCallback, useEffect, useState } from 'react'

import { Col, Row, Space, Switch, Typography } from 'antd'
import InputCopy from 'app/components/inputCopy'
import QRcode from 'qrcode.react'

import { useAccount, useWallet } from 'senhub/providers'

const Receive = ({ accountAddr }: { accountAddr: string }) => {
  const { accounts } = useAccount()
  const { wallet } = useWallet()
  const [devMode, setDevMode] = useState(false)
  const [addressDisplay, setAddressDisplay] = useState('')

  const getAccountWithMode = useCallback(async () => {
    if (!devMode || accountAddr === wallet.address)
      return setAddressDisplay(wallet.address)

    const splt = window.sentre.splt
    const mint = accounts[accountAddr].mint
    const deriveAddress = await splt.deriveAssociatedAddress(
      wallet.address,
      mint,
    )
    return setAddressDisplay(deriveAddress)
  }, [accountAddr, accounts, devMode, wallet.address])

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
            {accountAddr !== wallet.address && (
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

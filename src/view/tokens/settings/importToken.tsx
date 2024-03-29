import { Fragment, useState } from 'react'
import { account } from '@senswap/sen-js'
import {
  tokenProvider,
  useWalletAddress,
  useAccounts,
  useTheme,
  splt,
} from '@sentre/senhub'

import { Row, Col, Typography, Button, Modal } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import { MintSelection } from '@sen-use/app'

import { notifyError, notifySuccess } from 'helper'

const ImportToken = () => {
  const [visible, setVisible] = useState(false)
  const [mintAddress, setMintAddress] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const walletAddress = useWalletAddress()
  const accounts = useAccounts()
  const theme = useTheme()
  const initializeAccount = async () => {
    try {
      const { solana } = window.sentre
      const accountAddress = await splt.deriveAssociatedAddress(
        walletAddress,
        mintAddress,
      )
      const token = await tokenProvider.findByAddress(mintAddress)
      if (!account.isAddress(walletAddress) || !solana)
        throw new Error('Wallet is not connected')

      if (!account.isAddress(mintAddress))
        throw new Error('Please select the token first')

      if (accounts[accountAddress])
        throw new Error('The token had been imported')
      setLoading(true)

      const { txId } = await splt.initializeAccount(
        mintAddress,
        walletAddress,
        solana,
      )
      setMintAddress('')
      return notifySuccess(`Import ${token?.symbol}`, txId)
    } catch (err) {
      return notifyError(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Fragment>
      <Button
        type="primary"
        icon={<IonIcon name="add-outline" />}
        onClick={() => setVisible(true)}
        block
      >
        Import token
      </Button>
      <Modal
        open={visible}
        footer={false}
        onCancel={() => setVisible(false)}
        width={445}
        centered
        closeIcon={<IonIcon name="close-outline" />}
      >
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Typography.Title level={5}>Import Tokens</Typography.Title>
          </Col>
          <Col span={24}>
            <MintSelection
              value={mintAddress}
              onChange={(value) => setMintAddress(value)}
              style={{
                width: '100%',
                height: '100%',
                padding: 13,
                background: theme === 'light' ? '#FFFFFF' : '#2c2e3d',
              }}
            />
          </Col>
          <Col span={24}>
            <Button
              size="large"
              type="primary"
              block
              disabled={mintAddress === ''}
              onClick={initializeAccount}
              loading={loading}
            >
              Import
            </Button>
          </Col>
        </Row>
      </Modal>
    </Fragment>
  )
}

export default ImportToken

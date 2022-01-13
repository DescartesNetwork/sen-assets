import { useCallback, useEffect, useState } from 'react'
import LazyLoad from '@senswap/react-lazyload'
import { account } from '@senswap/sen-js'
import { TokenInfo } from '@solana/spl-token-registry'
import { useAccount, useMint, useWallet } from '@senhub/providers'

import {
  Row,
  Col,
  Typography,
  Button,
  Modal,
  Card,
  Space,
  Input,
  Avatar,
} from 'antd'
import IonIcon from 'shared/antd/ionicon'

import { notifyError, notifySuccess } from 'app/helper'

const KEY_SIZE = 3

/**
 * Mint Card
 * @returns
 */
const MintCard = ({ mint }: { mint: TokenInfo }) => {
  const { logoURI, symbol, name, address: mintAddress } = mint
  const [initialized, setInitialized] = useState(false)
  const {
    wallet: { address: walletAddress },
  } = useWallet()
  const { accounts } = useAccount()

  const initializeAccount = async () => {
    try {
      const { splt, wallet } = window.sentre
      if (!account.isAddress(walletAddress) || !wallet)
        throw new Error('Wallet is not connected')
      if (initialized) throw new Error('The token had been imported')
      if (!account.isAddress(mintAddress))
        throw new Error('Please select the token first')
      const { txId } = await splt.initializeAccount(
        mintAddress,
        walletAddress,
        wallet,
      )
      return notifySuccess(`Import ${symbol}`, txId)
    } catch (err) {
      return notifyError(err)
    }
  }

  useEffect(() => {
    ;(async () => {
      const { splt } = window.sentre
      const accountAddress = await splt.deriveAssociatedAddress(
        walletAddress,
        mintAddress,
      )
      return setInitialized(Object.keys(accounts).includes(accountAddress))
    })()
  }, [accounts, mintAddress, walletAddress])

  return (
    <Card className="account-item" bodyStyle={{ padding: 16 }} bordered={false}>
      <Row gutter={[16, 16]} wrap={false}>
        <Col flex="auto">
          <Space>
            <Avatar src={logoURI} />
            <Typography.Text type="secondary">{symbol}</Typography.Text>
            <Typography.Text>{name}</Typography.Text>
          </Space>
        </Col>
        <Col>
          <Button
            type="text"
            style={{ color: initialized ? '#3DBA4E' : 'inherit' }}
            icon={
              <IonIcon
                name={initialized ? 'checkmark-outline' : 'add-outline'}
              />
            }
            onClick={initializeAccount}
          />
        </Col>
      </Row>
    </Card>
  )
}

/**
 * Search bar
 */

let timeoutId: ReturnType<typeof setTimeout> | undefined
const Search = ({
  onChange,
}: {
  onChange: (data: TokenInfo[] | null) => void
}) => {
  const [loading, setLoading] = useState(false)
  const [keyword, setKeyword] = useState('')
  const { tokenProvider } = useMint()

  const search = useCallback(async () => {
    if (!keyword || keyword.length < KEY_SIZE) return onChange(null)
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(async () => {
      await setLoading(true)
      const data = await tokenProvider.find(keyword)
      await setLoading(false)
      return onChange(data)
    }, 500)
  }, [keyword, onChange, tokenProvider])

  useEffect(() => {
    search()
  }, [search])

  return (
    <Card bodyStyle={{ padding: 8 }} bordered={false}>
      <Input
        placeholder="Search"
        value={keyword}
        size="small"
        bordered={false}
        prefix={
          <Button
            type="text"
            style={{ marginLeft: -7 }}
            size="small"
            onClick={keyword ? () => setKeyword('') : () => {}}
            icon={
              <IonIcon name={keyword ? 'close-outline' : 'search-outline'} />
            }
            loading={loading}
          />
        }
        onChange={(e) => setKeyword(e.target.value)}
      />
    </Card>
  )
}

/**
 * Main
 */
const ImportToken = () => {
  const [visible, setVisible] = useState(false)
  const [mints, setMints] = useState<TokenInfo[]>()
  const [searchedMints, setSearchedMints] = useState<TokenInfo[] | null>()
  const { tokenProvider } = useMint()

  useEffect(() => {
    ;(async () => {
      const mints = await tokenProvider.all()
      return setMints(mints)
    })()
  }, [tokenProvider])

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Button
          type="primary"
          icon={<IonIcon name="add-outline" />}
          onClick={() => setVisible(true)}
          block
        >
          Import token
        </Button>
      </Col>
      <Modal
        visible={visible}
        onCancel={() => setVisible(false)}
        closeIcon={<IonIcon name="close-outline" />}
        footer={null}
        centered
        destroyOnClose
      >
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Typography.Title level={5}>Import Tokens</Typography.Title>
          </Col>
          <Col span={24}>
            <Search onChange={setSearchedMints} />
          </Col>
          <Col span={24}>
            <Row
              gutter={[16, 16]}
              style={{ maxHeight: 300 }}
              className="scrollbar"
            >
              {(searchedMints || mints || []).map((mint, i) => {
                return (
                  <Col span={24} key={i}>
                    <LazyLoad height={64} overflow>
                      <MintCard mint={mint} />
                    </LazyLoad>
                  </Col>
                )
              })}
            </Row>
          </Col>
        </Row>
      </Modal>
    </Row>
  )
}

export default ImportToken

import { useEffect, useState } from 'react'
import LazyLoad from 'react-lazyload'
import { account, } from '@senswap/sen-js'

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
import IonIcon from 'shared/ionicon'
import { useAccount, useMint, useWallet } from 'senhub/providers'
import { explorer } from 'shared/util'
import { MintAvatar } from 'app/shared/components/mint'
import { TokenInfo } from '@solana/spl-token-registry'
import PowerBy from 'os/components/powerBy'

const KEYSIZE = 3

/**
 * Mint Card
 * @returns
 */
const MintCard = ({ mint }: { mint: TokenInfo }) => {
  const { logoURI, symbol, name, address: mintAddress } = mint
  const [isInitialized, setIsInitialized] = useState(false)
  const {
    wallet: { address: walletAddress },
  } = useWallet()
  const {
    accounts
  } = useAccount()

  const initializeAccount = async () => {
    const { splt, wallet } = window.sentre

    if (
      isInitialized ||
      !account.isAddress(walletAddress) ||
      !account.isAddress(mintAddress) ||
      !wallet
    )
      return
    try {
      const { txId } = await splt.initializeAccount(
        mintAddress,
        walletAddress,
        wallet,
      )
      return window.notify({
        type: 'success',
        description: `Import ${symbol} successfully. Click to view details.`,
        onClick: () => window.open(explorer(txId), '_blank'),
      })
    } catch (er: any) {
      return window.notify({
        type: 'error',
        description: er.message,
      })
    }
  }

  useEffect(() => {
    ; (async () => {
      const { splt } = window.sentre
      const accountAddress = await splt.deriveAssociatedAddress(
        walletAddress,
        mintAddress,
      )
      return setIsInitialized(Object.keys(accounts).includes(accountAddress))
    })()
  }, [accounts, mintAddress, walletAddress])

  return (
    <Card bodyStyle={{ padding: 16 }} bordered={false}>
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
            style={{ color: isInitialized ? '#3DBA4E' : 'inherit' }}
            icon={
              <IonIcon
                name={isInitialized ? 'checkmark-outline' : 'add-outline'}
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

const Search = ({ onChange }: { onChange: (data: TokenInfo[] | null) => void }) => {
  const [keyword, setKeyword] = useState('')
  const { tokenProvider } = useMint()

  useEffect(() => {
    ; (async () => {
      if (!keyword || keyword.length < KEYSIZE) return onChange(null)
      const data = await tokenProvider.find(keyword)
      return onChange(data)
    })()
  }, [keyword, onChange, tokenProvider])

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
            onClick={keyword ? () => setKeyword('') : () => { }}
            icon={<IonIcon name={keyword ? 'close-outline' : 'search-outline'} />}
          />
        }
        suffix={<PowerBy />}
        onChange={(e) => setKeyword(e.target.value)}
      />
    </Card>
  )
}

const ImportToken = () => {
  const [visible, setVisible] = useState(false)
  const [mints, setMints] = useState<TokenInfo[]>()
  const [searchedMints, setSearchedMints] = useState<TokenInfo[] | null>()
  const { tokenProvider } = useMint()

  useEffect(() => {
    ; (async () => {
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
            <Typography.Title level={5}>Token Selection</Typography.Title>
          </Col>
          <Col span={24}>
            <Search onChange={setSearchedMints} />
          </Col>
          <Col span={24}>
            <Row gutter={[16, 16]} style={{ height: 300, overflow: 'auto' }}>
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

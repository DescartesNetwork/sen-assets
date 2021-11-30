import { useCallback, useEffect, useMemo, useState } from 'react'

import { Button, Col, Row, Select, Space, Typography } from 'antd'
import IonIcon from 'shared/ionicon'
import MintAvatar from 'app/shared/components/mintAvatar'

import { useAccount, useMint } from 'senhub/providers'

const WalletConnections = ({
  solWallet = false,
  value = 'Select',
  onChange = () => {},
}: {
  solWallet?: boolean
  value?: string
  onChange?: (mintAddress: string) => void
}) => {
  const [listAccount, setListAccount] = useState<string[]>([])
  const { tokenProvider } = useMint()
  const { accounts } = useAccount()

  const getAccountAddress = useCallback(async () => {
    const listAccount: string[] = []
    // sort, prioritize sen account
    const prioritizeAccount = []
    for (const addr in accounts) {
      const { mint } = accounts[addr] || {}
      const token = await tokenProvider.findByAddress(mint)
      if (token) {
        // check prioritize
        if (token.symbol === 'SEN') prioritizeAccount.push(addr)
        else listAccount.unshift(addr)
        continue
      }
      listAccount.push(addr)
    }
    return setListAccount([...prioritizeAccount, ...listAccount])
  }, [accounts, tokenProvider])

  useEffect(() => {
    getAccountAddress()
  }, [getAccountAddress])

  const solAddress = useMemo(() => {
    return accounts?.[listAccount[0]]?.mint || ''
  }, [accounts, listAccount])

  return (
    <Row gutter={[16, 16]}>
      <Col flex="auto">
        <Select
          onChange={onChange}
          value={solWallet ? solAddress : value}
          bordered={false}
          suffixIcon={<IonIcon name="chevron-down-outline" />}
          size="large"
          style={{ marginLeft: -4 }}
          className="custom-selector"
          dropdownStyle={{ lineHeight: 'nomarl' }}
          disabled={solWallet}
        >
          <Select.Option value={'Select'}>
            <Space>
              <MintAvatar
                size={32}
                mintAddress={'Select'}
                icon={<IonIcon name="help-outline" />}
              />
              <Space direction="vertical" size={0}>
                <Typography.Text style={{ fontWeight: 600 }}>
                  Select
                </Typography.Text>
                <Typography.Text style={{ fontSize: 12 }}>
                  wallet address
                </Typography.Text>
              </Space>
            </Space>
          </Select.Option>
          {listAccount?.map((accountAddr, i) => {
            const { mint } = accounts[accountAddr] || {}
            const shortenMintAddress = mint.substring(0, 6)
            return (
              <Select.Option key={mint + i} value={mint}>
                <Space>
                  <MintAvatar mintAddress={mint} size={32} />
                  <Space direction="vertical" size={0}>
                    <Typography.Text style={{ fontWeight: 600 }}>
                      {shortenMintAddress}
                    </Typography.Text>
                    <Typography.Text style={{ fontSize: 12 }}>
                      {shortenMintAddress}
                    </Typography.Text>
                  </Space>
                </Space>
              </Select.Option>
            )
          })}
        </Select>
      </Col>
      <Col>
        <Button size="small">Connect</Button>
      </Col>
    </Row>
  )
}

export default WalletConnections

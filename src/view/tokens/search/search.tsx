import { useState, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { AccountData } from '@senswap/sen-js'
import { useAccount, useMint, usePool, useUI } from '@sentre/senhub'

import { Input, Button, Space, Row, Col } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

import { AppState } from 'model'
import ModalSendToken from '../modalSendToken'
import Settings from '../settings'

const KEY_SIZE = 2

const Search = ({
  onChange,
}: {
  onChange: (account: Record<string, AccountData>) => void
}) => {
  const { hiddenZeros, hiddenUnknownTokens } = useSelector(
    (state: AppState) => state.settings,
  )
  const [keyword, setKeyword] = useState('')
  const { accounts } = useAccount()
  const { tokenProvider } = useMint()
  const { pools } = usePool()
  const {
    ui: { width },
  } = useUI()
  const isMobile = width < 992

  // Check visible account with settings
  const checkVisible = useCallback(
    async (account: AccountData) => {
      const { mint, amount } = account
      if (!amount && hiddenZeros) return false

      const mintData = await tokenProvider.findByAddress(mint)
      if (mintData) return true
      for (const pool of Object.values(pools)) {
        if (pool.mint_lpt === mint) return true
      }
      return !hiddenUnknownTokens
    },
    [hiddenUnknownTokens, hiddenZeros, pools, tokenProvider],
  )

  const onSearch = useCallback(async () => {
    const accountFilter: Record<string, AccountData> = {}
    for (const accAddr in accounts) {
      const account = accounts[accAddr]
      if (keyword && keyword.length > KEY_SIZE) {
        const tokens = await tokenProvider.find(keyword)
        const mints = tokens.map((token) => token.address)
        if (!mints.includes(account.mint)) continue
      }
      const visible = await checkVisible(account)
      if (visible) accountFilter[accAddr] = account
    }
    return onChange(accountFilter)
  }, [accounts, keyword, onChange, tokenProvider, checkVisible])

  useEffect(() => {
    onSearch()
  }, [onSearch])

  return (
    <Row gutter={[8, 0]} wrap={false}>
      <Col flex="auto">
        <Input
          className="search-assets"
          placeholder="Search"
          size="large"
          style={{
            minWidth: isMobile ? undefined : 296,
          }}
          value={keyword}
          prefix={
            <Button
              type="text"
              style={{ marginLeft: -7 }}
              size="small"
              onClick={keyword ? () => setKeyword('') : () => {}}
              icon={
                <IonIcon name={keyword ? 'close-outline' : 'search-outline'} />
              }
            />
          }
          onChange={(e) => setKeyword(e.target.value)}
        />
      </Col>
      <Col>
        <Space size={8}>
          <Settings />
          <ModalSendToken />
        </Space>
      </Col>
    </Row>
  )
}

export default Search

import { useState, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { AccountData } from '@senswap/sen-js'
import { tokenProvider, useUI, useAccounts } from '@sentre/senhub'
import { forceCheck } from '@sentre/react-lazyload'

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
  const accounts = useAccounts()
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
      return !hiddenUnknownTokens
    },
    [hiddenUnknownTokens, hiddenZeros],
  )

  const onSearch = useCallback(async () => {
    const filteredAccount: Record<string, AccountData> = {}
    const tokens = await tokenProvider.find(keyword, 0)
    const mints = tokens.map((token) => token.address)

    for (const accAddr in accounts) {
      const account = accounts[accAddr]
      if (keyword && keyword.length > KEY_SIZE) {
        if (!mints.includes(account.mint)) continue
      }
      const visible = await checkVisible(account)
      if (visible) filteredAccount[accAddr] = account
    }
    return onChange(filteredAccount)
  }, [accounts, keyword, onChange, checkVisible])

  useEffect(() => {
    onSearch()
    const timeout = setTimeout(() => {
      forceCheck()
    }, 300)
    return () => clearTimeout(timeout)
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

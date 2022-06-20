import { useState, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { AccountData } from '@senswap/sen-js'
import { useAccount, useMint, usePool } from '@senhub/providers'

import { Row, Col, Input, Button } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

import { AppState } from 'app/model'
import ModalSendToken from '../modalSendToken'

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
    <Row gutter={[16, 16]}>
      <Col flex="1 0">
        <Input
          placeholder="Search"
          value={keyword}
          size="large"
          style={{ background: 'transparent' }}
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
        <ModalSendToken />
      </Col>
    </Row>
  )
}

export default Search

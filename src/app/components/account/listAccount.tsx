import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AccountData } from '@senswap/sen-js'

import { Col, Row } from 'antd'
import AccountItem from './accountItem'
import Search from 'app/components/search/search'
import LazyLoad from 'react-lazyload'

import { useMint } from 'senhub/providers'
import { selectAccount } from 'app/model/account.controller'
import { AppState } from 'app/model'

const ListAccount = () => {
  const dispatch = useDispatch()
  const { accountSelected } = useSelector((state: AppState) => state.account)
  const [listAccount, setListAccount] = useState<string[]>([])
  const { tokenProvider } = useMint()

  const onSearch = useCallback(
    async (accounts: Record<string, AccountData>) => {
      const listAccount: string[] = []
      // sort, prioritize sen account
      const prioritizeAccount = []
      for (const addr in accounts) {
        const acc = accounts[addr]
        const token = await tokenProvider.findByAddress(acc.mint)
        if (token) {
          // check prioritize
          if (token.symbol === 'SEN') prioritizeAccount.push(addr)
          else listAccount.unshift(addr)
          continue
        }
        listAccount.push(addr)
      }
      return setListAccount([...prioritizeAccount, ...listAccount])
    },
    [tokenProvider],
  )

  useEffect(() => {
    if (accountSelected || !listAccount[0]) return
    dispatch(selectAccount({ account: listAccount[0] }))
  }, [accountSelected, dispatch, listAccount])

  return (
    <Row gutter={[12, 12]}>
      <Col span={24}>
        <Search onChange={onSearch} />
      </Col>
      {listAccount.map((address) => (
        <Col span={24} key={address}>
          <LazyLoad height={64} overflow>
            <AccountItem
              address={address}
              active={accountSelected === address}
              onClick={(account) => dispatch(selectAccount({ account }))}
            />
          </LazyLoad>
        </Col>
      ))}
    </Row>
  )
}

export default ListAccount

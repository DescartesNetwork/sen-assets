import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AccountData } from '@senswap/sen-js'
import LazyLoad from '@senswap/react-lazyload'
import { useMint, useWallet } from '@senhub/providers'

import { Col, Row } from 'antd'
import AccountCard from './accountCard'
import Search from 'app/page/walletAccounts/search/search'
import Sol from './solCard'

import { selectAccount } from 'app/model/account.controller'
import { AppDispatch, AppState } from 'app/model'

const ListAccount = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { accountSelected } = useSelector((state: AppState) => state.account)
  const { tokenProvider } = useMint()
  const { wallet } = useWallet()
  const [listAccount, setListAccount] = useState<string[]>([])

  const onSearch = useCallback(
    async (accounts: Record<string, AccountData>) => {
      const listAccount: string[] = []
      // sort, prioritize sen account
      const prioritizeAccount = []
      for (const addr in accounts) {
        const acc = accounts[addr]
        const token = await tokenProvider.findByAddress(acc.mint)
        console.log(token, 'Im here')
        if (token) {
          // check prioritize
          if (token.symbol === 'SNTR') prioritizeAccount.push(addr)
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
    if (accountSelected) return
    dispatch(selectAccount({ account: wallet.address }))
  }, [accountSelected, dispatch, wallet.address])

  return (
    <Row gutter={[12, 12]}>
      <Col span={24}>
        <Search onChange={onSearch} />
      </Col>
      <Col span={24}>
        <Sol
          active={accountSelected === wallet.address}
          onClick={(account) => dispatch(selectAccount({ account }))}
        />
      </Col>
      {listAccount.map((address) => (
        <Col span={24} key={address}>
          <LazyLoad height={68} offset={150} overflow>
            <AccountCard
              accountAddr={address}
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

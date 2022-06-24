import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AccountData } from '@senswap/sen-js'
import LazyLoad from '@sentre/react-lazyload'
import { useMint, useWallet } from '@senhub/providers'

import { Col, Row, Typography } from 'antd'
import AccountCard from './accountCard'
import Search from 'app/view/tokens/search/search'

import { selectAccount } from 'app/model/account.controller'
import { AppDispatch, AppState } from 'app/model'
import configs from 'app/configs'

const {
  sol: { sntrAddress },
} = configs

const ListAccount = () => {
  const { accountSelected } = useSelector((state: AppState) => state.account)
  const { tokenProvider } = useMint()
  const { wallet } = useWallet()
  const [listAccount, setListAccount] = useState<string[]>([])
  const dispatch = useDispatch<AppDispatch>()

  const onSearch = useCallback(
    async (accounts: Record<string, AccountData>) => {
      const listAccount: string[] = []
      // sort, prioritize sen account
      const prioritizeAccount = []
      for (const addr in accounts) {
        const acc = accounts[addr]
        const token = await tokenProvider.findByAddress(acc.mint)
        const sntr = await tokenProvider.findByAddress(sntrAddress)
        if (token) {
          // check prioritize
          if (token.symbol === sntr?.symbol) prioritizeAccount.push(addr)
          else listAccount.unshift(addr)
          continue
        }
        listAccount.push(addr)
      }
      console.log('listAccount: ', listAccount)
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
      <Col flex="auto">
        <Typography.Title level={2}>Tokens Asset</Typography.Title>
      </Col>
      <Col>
        <Search onChange={onSearch} />
      </Col>
      <Col span={24}>
        <AccountCard
          accountAddr={wallet.address}
          active={accountSelected === wallet.address}
          onClick={(account) => {
            dispatch(selectAccount({ account }))
          }}
          isSol
        />
      </Col>
      {listAccount.map((address) => (
        <Col span={24} key={address}>
          <LazyLoad height={68} overflow>
            <AccountCard
              accountAddr={address}
              onClick={(account) => {
                dispatch(selectAccount({ account }))
              }}
            />
          </LazyLoad>
        </Col>
      ))}
    </Row>
  )
}

export default ListAccount

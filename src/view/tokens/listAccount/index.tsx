import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AccountData } from '@senswap/sen-js'
import LazyLoad from '@sentre/react-lazyload'
import { tokenProvider, useUI, useWalletAddress } from '@sentre/senhub'

import { Col, Row, Typography } from 'antd'
import AccountCard from './accountCard'
import Search from 'view/tokens/search/search'

import { selectAccount } from 'model/account.controller'
import { AppDispatch, AppState } from 'model'
import configs from 'configs'

const {
  sol: { sntrAddress },
} = configs

const ListAccount = () => {
  const { accountSelected } = useSelector((state: AppState) => state.account)
  const walletAddress = useWalletAddress()
  const [listAccount, setListAccount] = useState<string[]>([])
  const dispatch = useDispatch<AppDispatch>()
  const {
    ui: { width },
  } = useUI()
  const isMobile = width < 992

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
      return setListAccount([...prioritizeAccount, ...listAccount])
    },
    [],
  )

  useEffect(() => {
    if (accountSelected) return
    dispatch(selectAccount({ account: walletAddress }))
  }, [accountSelected, dispatch, walletAddress])

  return (
    <Row gutter={[12, 12]}>
      <Col flex="auto">
        <Typography.Title level={2}>Token Assets</Typography.Title>
      </Col>
      <Col span={isMobile ? 24 : undefined}>
        <Search onChange={onSearch} />
      </Col>
      <Col span={24} style={{ paddingTop: 12 }}>
        <AccountCard
          accountAddr={walletAddress}
          active={accountSelected === walletAddress}
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

import { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { AccountData } from '@senswap/sen-js'
import LazyLoad from '@senswap/react-lazyload'
import { useMint } from '@senhub/providers'

import { Col, Row } from 'antd'
import AccountItem from './accountItem'
import Search from 'app/page/walletAccounts/search/search'
import Sol from 'app/page/walletAccounts/listAccount/solCard'

import { selectAccount } from 'app/model/account.controller'
import configs from 'app/configs'
import { AppDispatch } from 'app/model'

const {
  manifest: { appId },
} = configs

const ListAccount = () => {
  const dispatch = useDispatch<AppDispatch>()
  const history = useHistory()
  const { tokenProvider } = useMint()
  const [listAccount, setListAccount] = useState<string[]>([])

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

  const handleOnClick = (account: string) => {
    dispatch(selectAccount({ account }))
    return history.push(`/app/${appId}`)
  }

  return (
    <Row gutter={[12, 12]} align="middle">
      <Col span={24}>
        <Search onChange={onSearch} />
      </Col>
      <Col span={24}>
        <Sol onClick={(account) => handleOnClick(account)} price={false} />
      </Col>
      {listAccount.map((address) => (
        <Col span={24} key={address}>
          <LazyLoad height={70} offset={70} overflow>
            <AccountItem
              accountAddr={address}
              onClick={(account) => handleOnClick(account)}
            />
          </LazyLoad>
        </Col>
      ))}
    </Row>
  )
}

export default ListAccount

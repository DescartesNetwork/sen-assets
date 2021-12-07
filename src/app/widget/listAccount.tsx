import { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { Col, Row } from 'antd'
import AccountItem from './accountItem'
import Search from 'app/page/walletAccounts/search/search'
import LazyLoad from 'react-lazyload'
import Sol from 'app/page/walletAccounts/solCard'

import { useMint } from 'senhub/providers'
import { AccountData } from '@senswap/sen-js'
import { selectAccount } from 'app/model/account.controller'
import configs from 'app/configs'

const {
  manifest: { appId },
} = configs

const ListAccount = () => {
  const dispatch = useDispatch()
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
        <Sol onClick={(account) => handleOnClick(account)} />
      </Col>
      {listAccount.map((address) => (
        <Col span={24} key={address}>
          <LazyLoad height={64} overflow>
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

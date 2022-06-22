import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AccountData } from '@senswap/sen-js'
import LazyLoad from '@sentre/react-lazyload'
import { useMint, useWallet } from '@senhub/providers'

import { Col, Row, Modal, Typography } from 'antd'
import AccountCard from './accountCard'
import Search from 'app/view/tokens/search/search'
import Balance from 'app/view/accountAction'
import Sol from './solCard'

import { selectAccount } from 'app/model/account.controller'
import { AppDispatch, AppState } from 'app/model'
import configs from 'app/configs'

const {
  sol: { sntrAddress },
} = configs

const ListAccount = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { accountSelected } = useSelector((state: AppState) => state.account)
  const { tokenProvider } = useMint()
  const { wallet } = useWallet()
  const [listAccount, setListAccount] = useState<string[]>([])
  const [visible, setVisible] = useState(false)

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
        <Sol
          active={accountSelected === wallet.address}
          onClick={(account) => dispatch(selectAccount({ account }))}
        />
      </Col>
      {listAccount.map((address) => (
        <Col span={24} key={address}>
          <LazyLoad height={68} overflow>
            <AccountCard
              accountAddr={address}
              active={accountSelected === address}
              onClick={(account) => {
                dispatch(selectAccount({ account }))
                setVisible(true)
              }}
            />
          </LazyLoad>
        </Col>
      ))}
      <Modal
        visible={visible}
        footer={false}
        onCancel={() => setVisible(false)}
        maskClosable={true}
        centered
        className="modal-sen-assets"
        bodyStyle={{
          borderRadius: '16px',
        }}
      >
        <Balance />
      </Modal>
    </Row>
  )
}

export default ListAccount

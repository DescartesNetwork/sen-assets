import { useSelector } from 'react-redux'

import { Col, Row, Space, Typography } from 'antd'
import WalletAddress from './walletAddress/walletAddress'
import { TokenPrice } from './tokenPrice'

import { DEFAULT_EMPTY_ADDRESS, utils } from '@senswap/sen-js'
import { useAccount, useWallet } from 'senhub/providers'
import { numeric } from 'shared/util'
import { AppState } from 'app/model'
import useMintCgk from 'app/shared/hooks/useMintCgk'
import useMintDecimals from 'app/shared/hooks/useMintDecimals'
import { useEffect, useMemo, useState } from 'react'
import { fetchCGK } from 'shared/helper'

const Header = () => {
  const [solData, setSolData] = useState<CgkData>()
  const { accountSelected } = useSelector((state: AppState) => state.account)
  const { accounts } = useAccount()
  const { wallet: { lamports } } = useWallet()
  const account = accounts[accountSelected] || {}
  const mint = account.mint

  const isSolAddress = accountSelected === DEFAULT_EMPTY_ADDRESS
  const solBalance = utils.undecimalize(lamports, 9)
  const decimals = useMintDecimals(mint)
  const balance = utils.undecimalize(account.amount, decimals)
  const cgkData = useMintCgk(mint)

  const sourceBalance = useMemo(() => {
    if (isSolAddress) return solBalance
    return balance
  }, [isSolAddress, balance, solBalance])

  const total = useMemo(() => {
    let price = cgkData.price
    if (isSolAddress) return price = solData?.price
    return price * Number(sourceBalance)
  }, [cgkData, solData, isSolAddress, sourceBalance])

  useEffect(() => {
    ; (async () => {
      const solData = await (fetchCGK('solana'))
      setSolData(solData)
    })()
  }, [])

  return (
    <Row className="header-balance" gutter={[16, 16]}>
      {/* You balance + Address */}
      <Col span={24}>
        <Row>
          <Col flex="auto">
            <Typography.Text className="text-secondary">
              Your balance
            </Typography.Text>
          </Col>
          <Col>
            <WalletAddress />
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <Row gutter={[8, 8]}>
          <Col span={24}>
            <TokenPrice mintAddress={mint} solWallet={isSolAddress ? solData?.icon : false} />
          </Col>
          <Col span={24}>
            {/* Balance */}
            <Space align="baseline">
              <Typography.Title className="title-color" level={3}>
                {numeric(sourceBalance).format('0,0.[000]')}
              </Typography.Title>
              <Typography.Text className="text-secondary">
                ~{numeric(total).format('0,0.[000]')}
              </Typography.Text>
            </Space>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}
export default Header

import { Fragment, useEffect, useMemo, useState } from 'react'
import { account, DEFAULT_WSOL, utils } from '@senswap/sen-js'

import { Button, Col, Row, Space, Typography } from 'antd'
import { MintSymbol } from 'app/shared/components/mint'

import useMintDecimals from 'app/shared/hooks/useMintDecimals'
import { useAccount, useWallet } from 'senhub/providers'
import { explorer } from 'shared/util'
import NumericInput from 'app/shared/components/numericInput'

const TRANSACTION_FEE = 0.00001
const COMPENSATION = BigInt(2039280)
const DEFAULT_DECIMAL = 9

const Wrap = ({ accountAddr }: { accountAddr: string }) => {
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [wsolAddress, setWSolAddress] = useState('')
  const { accounts } = useAccount()
  const { splt, wallet } = window.sentre

  const { amount: maxAmount, mint } = accounts[accountAddr] || {}
  const decimals = useMintDecimals(mint)
  const balance = utils.undecimalize(maxAmount, decimals)
  const { wallet: { lamports, address: ownerAddress } } = useWallet()
  const balanceSol = utils.undecimalize(lamports, DEFAULT_DECIMAL)
  const isSolAccount = accountAddr === DEFAULT_WSOL

  const wsolData = useMemo(() => {
    return accounts[wsolAddress]
  }, [accounts, wsolAddress])
  const sourceBalance = useMemo(() => {
    if (isSolAccount) return balanceSol
    return balance
  }, [isSolAccount, balance, balanceSol])
  const unWrapAmount = utils.undecimalize(wsolData?.amount, 9)

  const maxBalance = useMemo(() => {
    const balance = Number(sourceBalance)
    const compensation = Number(utils.undecimalize(BigInt(100000000) + COMPENSATION, DEFAULT_DECIMAL))
    const fee = compensation + TRANSACTION_FEE
    if (balance <= fee) return sourceBalance
    return balance - fee
  }, [sourceBalance])

  const { state } = wsolData || {}
  const isUnWrap = state === 1

  // Wrapper sol to wsol
  const wrap = async () => {
    try {
      const { splt, wallet } = window.sentre
      if (!account.isAddress(ownerAddress))
        return window.notify({ type: 'error', description: 'Please connect your wallet' })
      let amount = BigInt(0)
      try {
        amount = utils.decimalize(value, 9)
      } catch (er) {
        /* Skip errors */
      }
      if (!amount) return window.notify({ type: 'error', description: 'Invalid amount' })
      if (!wallet) return window.notify({ type: 'error', description: 'Wallet is not connected' })
      setLoading(true)
      const { txId } = await splt.wrap(
        amount + COMPENSATION,
        ownerAddress,
        wallet,
      )
      window.notify({
        type: 'success',
        description: `Wrap ${value} SOL successfully. Click to view details.`,
        onClick: () => window.open(explorer(txId), '_blank'),
      })
    } catch (er: any) {
      return window.notify({
        type: 'error',
        description: er?.message
      })
    } finally {
      setLoading(false)
    }
  }

  const unwrap = async () => {
    setLoading(true)
    const wsol = utils.undecimalize(wsolData?.amount, 9) || 0
    try {
      if (!wallet) return window.notify({ type: 'error', description: 'Wallet is not connected' })
      const { txId } = await splt.unwrap(wallet)
      window.notify({
        type: 'success',
        description: `Unwrap ${wsol} SOL successfully. Click to view details.`,
        onClick: () => window.open(explorer(txId), '_blank'),
      })
    } catch (er: any) {
      return window.notify({ type: 'error', description: er?.message })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    (async () => {
      const wsolAddress = await splt.deriveAssociatedAddress(
        ownerAddress,
        DEFAULT_WSOL,
      )
      setWSolAddress(wsolAddress)
    })()
  }, [ownerAddress, accounts, splt])

  useEffect(() => {
    if (isUnWrap) return setValue(unWrapAmount)
    return setValue('')
  }, [unWrapAmount, state, isUnWrap])

  const WrapDescriptions = () => {
    return <Fragment>
      <ul style={{ paddingLeft: 16 }}>
        <li>
          <Typography.Text type="secondary">
            To wrap SOL you have to deposit an extra fee equal to 0.00203928
            SOL.
            </Typography.Text>
        </li>
        <li>
          <Typography.Text type="secondary">
            The fee mentioned above will return when you unwrap.
            </Typography.Text>
        </li>
      </ul>
    </Fragment>
  }
  const UnWrapDescriptions = () => {
    return <Fragment>
      <Typography.Text type="secondary">
        Due to technical limitations, it only allows:
        </Typography.Text>
      <ul style={{ paddingLeft: 16 }}>
        <li>
          <Typography.Text type="secondary">
            Unwrap all at once.
            </Typography.Text>
        </li>
        <li>
          <Typography.Text type="secondary">
            To increase/decrease the WSOL balance, unwrap all first then
            re-wrap your desired number.
            </Typography.Text>
        </li>
      </ul>
    </Fragment>
  }

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Row gutter={[8, 8]}>
          <Col flex="auto">
            <Typography.Text>{isUnWrap ? 'Unwrap amount' : 'Wrap Amount'}</Typography.Text>
          </Col>
          <Col>
            <Space size={4}>
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>Available:</Typography.Text>
              <Typography.Text style={{ fontSize: 12 }}>{isUnWrap ? unWrapAmount : sourceBalance} SOL</Typography.Text>
            </Space>
          </Col>
          <Col span={24}>
            <NumericInput
              placeholder={'0'}
              size="large"
              prefix={isSolAccount ? <Typography.Text type="secondary">SOL</Typography.Text> : <MintSymbol mintAddress={mint} />}
              suffix={state !== 1 &&
                <Button
                  type="text"
                  style={{ padding: 0, height: 'auto' }}
                  onClick={() => setValue(`${maxBalance}`)}
                >
                  MAX
                </Button>
              }
              value={value}
              onChange={setValue}
              max={maxBalance}
              disabled={state === 1}
            />
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        {isUnWrap ?
          <Button type="primary" onClick={unwrap} block loading={loading}>
            Unwrap
      </Button> :
          <Button type="primary" onClick={wrap} block loading={loading}>
            Wrap
        </Button>}
      </Col>
      <Col span={24} style={{ fontSize: 12 }}>
        {isUnWrap ? <UnWrapDescriptions /> : <WrapDescriptions />}
      </Col>
    </Row>
  )
}

export default Wrap

import { useEffect, useMemo, useState } from 'react'
import { account, DEFAULT_WSOL, utils } from '@senswap/sen-js'

import { Button, Col, Row, Switch, Typography } from 'antd'
import { MintSymbol } from 'app/shared/components/mint'

import useMintDecimals from 'app/shared/hooks/useMintDecimals'
import { useAccount, useWallet } from 'senhub/providers'
import { explorer } from 'shared/util'
import NumericInput from 'app/shared/components/numericInput'

const Wrapper = ({ accountAddr }: { accountAddr: string }) => {
  const [value, setValue] = useState('0')
  const [unwrapState, setUnwrapState] = useState(false)
  const [loading, setLoading] = useState(false)
  const [wsolAddress, setWSolAddress] = useState('')
  const { accounts } = useAccount()
  const { splt, wallet } = window.sentre

  const { amount: maxAmount, mint } = accounts[accountAddr] || {}
  const decimals = useMintDecimals(mint)
  const balance = utils.undecimalize(maxAmount, decimals)
  const { wallet: { lamports, address: ownerAddress } } = useWallet()
  const balanceSol = utils.undecimalize(lamports, 9)
  const isSolAccount = accountAddr === DEFAULT_WSOL

  const wsolData = useMemo(() => {
    return accounts[wsolAddress]
  }, [accounts, wsolAddress])
  const sourceBalance = useMemo(() => {
    if (isSolAccount) return balanceSol
    return balance
  }, [isSolAccount, balance, balanceSol])

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
      const compensation = BigInt(2039280)
      const { txId } = await splt.wrap(
        amount + compensation,
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
    const amount = utils.undecimalize(wsolData?.amount, 9)
    if (unwrapState) return setValue(amount)
    return setValue('0')
  }, [wsolData, unwrapState])

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Row gutter={[8, 8]}>
          <Col flex="auto">
            <Typography.Text>{!unwrapState ? 'Wrap Amount' : 'Unwrap amount'}</Typography.Text>
          </Col>
          <Col>
            <Switch size="small" checked={unwrapState} onChange={setUnwrapState} />
          </Col>
          <Col span={24}>
            <NumericInput
              placeholder={'0'}
              size="large"
              prefix={isSolAccount ? <Typography.Text type="secondary">SOL</Typography.Text> : <MintSymbol mintAddress={mint} />}
              suffix={!unwrapState &&
                <Button
                  type="text"
                  style={{ padding: 0, height: 'auto' }}
                  onClick={() => setValue(sourceBalance)}
                >
                  MAX
                </Button>
              }
              value={value}
              onChange={setValue}
              max={sourceBalance}
              disabled={unwrapState}
            />
          </Col>
        </Row>
      </Col>
      <Col span={24}>{!unwrapState ?
        <Button type="primary" onClick={wrap} block loading={loading}>
          Wrap
        </Button> :
        <Button type="primary" onClick={unwrap} block loading={loading}>
          Unwrap
      </Button>}
      </Col>
    </Row>
  )
}

export default Wrapper

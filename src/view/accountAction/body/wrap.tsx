import { Fragment, useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { DEFAULT_WSOL, utils } from '@senswap/sen-js'
import { useWallet } from '@sentre/senhub'

import { Button, Col, Row, Space, Typography } from 'antd'
import { MintSymbol } from '@sen-use/components'
import NumericInput from 'shared/antd/numericInput'

import { notifyError, notifySuccess } from 'helper'
import { useMintAccount } from 'hooks/useMintAccount'
import { selectAccount } from 'model/account.controller'
import { SOL_DECIMALS } from 'constant/sol'
import { AppDispatch } from 'model'

const TRANSACTION_FEE = 0.00001
const COMPENSATION = BigInt(2039280)
const DEFAULT_DECIMAL = 9

const Wrap = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [wsolAddress, setWSolAddress] = useState('')
  const {
    wallet: { address: walletAddress },
  } = useWallet()

  const wSolData = useMintAccount(wsolAddress)
  const solData = useMintAccount(walletAddress)

  // close wrapSol account before wrap
  // amount = 0 => unwrap
  const isWrap = wSolData.amount === undefined

  const unWrapAmount = utils.undecimalize(wSolData.amount, wSolData.decimals)

  const maxWrapAmount = useMemo(() => {
    const solAmount = Number(solData.balance)
    const compensation = Number(
      utils.undecimalize(BigInt(100000000) + COMPENSATION, DEFAULT_DECIMAL),
    )
    const fee = compensation + TRANSACTION_FEE
    if (solAmount <= fee) return 0
    return solAmount - fee
  }, [solData.balance])

  // Wrapper sol to wsol
  const wrap = async () => {
    setLoading(true)
    try {
      const { splt, wallet } = window.sentre
      if (!wallet) throw new Error('Wallet is not connected')

      const wrapAmount = utils.decimalize(Number(value), SOL_DECIMALS)
      const { txId } = await splt.wrap(
        wrapAmount + COMPENSATION,
        walletAddress,
        wallet,
      )
      notifySuccess(`Wrap ${value} SOL`, txId)
    } catch (er) {
      return notifyError(er)
    } finally {
      setLoading(false)
    }
  }

  const unwrap = async () => {
    setLoading(true)
    try {
      const { splt, wallet } = window.sentre
      if (!wallet) throw new Error('Wallet is not connected')

      const { txId } = await splt.unwrap(wallet)
      await dispatch(selectAccount({ account: walletAddress }))
      return notifySuccess(`Unwrap ${wSolData.balance} SOL`, txId)
    } catch (er) {
      return notifyError(er)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    ;(async () => {
      const { splt } = window.sentre
      const wsolAddress = await splt.deriveAssociatedAddress(
        walletAddress,
        DEFAULT_WSOL,
      )
      setWSolAddress(wsolAddress)
    })()
  }, [walletAddress])

  useEffect(() => {
    if (!isWrap) return setValue(unWrapAmount)
    return setValue('')
  }, [isWrap, unWrapAmount])

  const WrapDescriptions = () => {
    return (
      <Fragment>
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
    )
  }

  const UnWrapDescriptions = () => {
    return (
      <Fragment>
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
    )
  }

  return (
    <Row gutter={[18, 18]}>
      <Col span={24}>
        <Row gutter={[8, 8]}>
          <Col flex="auto">
            <Typography.Text>
              {isWrap ? 'Wrap Amount' : 'Unwrap amount'}
            </Typography.Text>
          </Col>
          <Col>
            <Space size={4}>
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                Available:
              </Typography.Text>
              <Typography.Text style={{ fontSize: 12 }}>
                {isWrap ? solData.balance : unWrapAmount} SOL
              </Typography.Text>
            </Space>
          </Col>
          <Col span={24}>
            <NumericInput
              placeholder="0"
              size="large"
              prefix={
                <MintSymbol
                  mintAddress={isWrap ? solData.mint : wSolData.mint}
                />
              }
              suffix={
                isWrap && (
                  <Button
                    type="text"
                    style={{ padding: 0, height: 'auto' }}
                    onClick={() => setValue(`${maxWrapAmount}`)}
                  >
                    MAX
                  </Button>
                )
              }
              value={value}
              onValue={setValue}
              max={maxWrapAmount}
              disabled={!isWrap}
            />
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        {isWrap ? (
          <Button type="primary" onClick={wrap} block loading={loading}>
            Wrap
          </Button>
        ) : (
          <Button type="primary" onClick={unwrap} block loading={loading}>
            Unwrap
          </Button>
        )}
      </Col>
      <Col span={24} style={{ fontSize: 12 }}>
        {isWrap ? <WrapDescriptions /> : <UnWrapDescriptions />}
      </Col>
    </Row>
  )
}

export default Wrap

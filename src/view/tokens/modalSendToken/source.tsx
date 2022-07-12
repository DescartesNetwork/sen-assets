import { Fragment } from 'react'
import { useWallet } from '@sentre/senhub'
import { utils } from '@senswap/sen-js'

import { Row, Col, Typography, Button, Divider } from 'antd'
import { MintSelection, MintSymbol } from 'shared/antd/mint'
import NumericInput from 'shared/antd/numericInput'

import { useMintAccount } from 'hooks/useMintAccount'
import { util } from '@sentre/senhub'
import { SOL_ADDRESS } from 'constant/sol'

const PLATFORM_FEE = BigInt(5000)
const NETWORK_FEE = BigInt(5000)

const Source = ({
  accountAddr,
  onChange,
  amount,
  mintAddress,
}: {
  accountAddr: string
  onChange: (
    accountAddress: string,
    amount: string,
    mintAddress: string,
  ) => void
  amount: string
  mintAddress: string
}) => {
  const mintAccount = useMintAccount(accountAddr)
  const {
    wallet: { address: walletAddress, lamports },
  } = useWallet()

  const onSelectToken = async (mint: string) => {
    const { splt } = window.sentre
    if (mint === SOL_ADDRESS) return onChange(walletAddress, amount, mint)
    const accountAddress = await splt.deriveAssociatedAddress(
      walletAddress,
      mint,
    )

    onChange(accountAddress, amount, mint)
  }

  let max = mintAccount.balance
  if (mintAddress === SOL_ADDRESS)
    max = utils.undecimalize(lamports - PLATFORM_FEE - NETWORK_FEE, 9)

  return (
    <Row gutter={[8, 8]}>
      <Col flex="auto">
        <Typography.Text>Amount</Typography.Text>
      </Col>
      <Col>
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          Available: {util.numeric(mintAccount.balance).format('0,0.[00]a')}{' '}
          <MintSymbol mintAddress={mintAccount.mint} />
        </Typography.Text>
      </Col>
      <Col span={24}>
        <NumericInput
          placeholder="0"
          prefix={
            <Fragment>
              <MintSelection
                value={mintAddress}
                onChange={onSelectToken}
                nativeSol
              />
              <Divider type="vertical" />
            </Fragment>
          }
          suffix={
            <Button
              type="text"
              style={{ marginRight: -7 }}
              onClick={() => onChange(accountAddr, max, mintAddress)}
            >
              MAX
            </Button>
          }
          value={amount}
          onValue={(value) => onChange(accountAddr, value, mintAddress)}
          max={mintAccount.balance}
        />
      </Col>
    </Row>
  )
}

export default Source

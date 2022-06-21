import { Row, Col, Typography, Button, Divider } from 'antd'
import { MintSelection, MintSymbol } from 'shared/antd/mint'
import NumericInput from 'shared/antd/numericInput'

import { useMintAccount } from 'app/hooks/useMintAccount'
import { numeric } from 'shared/util'
import { Fragment } from 'react'
import { useWallet } from '@senhub/providers'

const Source = ({
  accountAddr,
  onChange,
  amount: value,
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
    wallet: { address: walletAddress },
  } = useWallet()

  const onSelectToken = async (mint: string) => {
    const { splt } = window.sentre
    const accountAddress = await splt.deriveAssociatedAddress(
      walletAddress,
      mint,
    )
    onChange(accountAddress, value, mint)
  }
  return (
    <Row gutter={[8, 8]}>
      <Col flex="auto">
        <Typography.Text>Amount</Typography.Text>
      </Col>
      <Col>
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          Available: {numeric(mintAccount.balance).format('0,0.[00]a')}{' '}
          <MintSymbol mintAddress={mintAccount.mint} />
        </Typography.Text>
      </Col>
      <Col span={24}>
        <NumericInput
          placeholder="0"
          prefix={
            <Fragment>
              <MintSelection value={mintAddress} onChange={onSelectToken} />
              <Divider type="vertical" />
            </Fragment>
          }
          suffix={
            <Button
              type="text"
              style={{ marginRight: -7 }}
              onClick={() =>
                onChange(accountAddr, mintAccount.balance, mintAddress)
              }
            >
              MAX
            </Button>
          }
          value={value}
          onValue={(value) => onChange(accountAddr, value, mintAddress)}
          max={mintAccount.balance}
        />
      </Col>
    </Row>
  )
}

export default Source

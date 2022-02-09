import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useWallet } from '@senhub/providers'
import { utils } from '@senswap/sen-js'
import { CHAIN_ID_SOLANA } from '@certusone/wormhole-sdk'

import { Space, Select, Divider, Typography, Avatar } from 'antd'

import { AppDispatch, AppState } from 'app/model'
import { randomColor } from 'shared/util'
import { fetchSolTokens, setSourceToken } from 'app/model/wormhole.controller'
import { SOL_ADDRESS } from 'app/lib/stat/constants/sol'

const SourceMintSelect = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    wormhole: { sourceTokens, sourceWalletAddress, tokenAddress, sourceChain },
  } = useSelector((state: AppState) => state)
  const {
    wallet: { lamports },
  } = useWallet()

  const onChange = (tokenAddress: string) =>
    dispatch(setSourceToken({ tokenAddress }))

  useEffect(() => {
    ;(async () => {
      const solBalance = utils.undecimalize(lamports, 9)
      if (
        !!sourceTokens[SOL_ADDRESS] ||
        !solBalance ||
        sourceChain !== CHAIN_ID_SOLANA
      )
        return null
      const cloneSourceToken = JSON.parse(JSON.stringify(sourceTokens))

      cloneSourceToken[SOL_ADDRESS] = {
        address: SOL_ADDRESS,
        amount: Number(solBalance),
        balance: `${lamports}`,
        decimals: 9,
        logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
        name: 'Sol nav',
        symbol: 'Sol',
      }
      await dispatch(fetchSolTokens({ sourceTokens: cloneSourceToken }))
    })()
  }, [dispatch, lamports, sourceChain, sourceTokens])

  return (
    <Select
      onChange={onChange}
      value={tokenAddress || 'Select'}
      bordered={false}
      suffixIcon={<Divider type="vertical" style={{ margin: 0 }} />}
      size="middle"
      style={{ marginLeft: -12 }}
      disabled={!sourceWalletAddress}
    >
      {Object.values(sourceTokens).map((token) => {
        return (
          <Select.Option value={token.address} key={token.address}>
            <Space align="center">
              <Avatar
                src={token.logo}
                size={24}
                style={{
                  border: 'none',
                  background: randomColor(token.address, 0.8),
                }}
              >
                {token.symbol.substring(0, 2) || token.address.substring(0, 2)}
              </Avatar>
              <Space direction="vertical" size={0}>
                <Typography.Text style={{ color: '#7A7B85' }}>
                  {token.symbol || token.address.substring(0, 4)}
                </Typography.Text>
              </Space>
            </Space>
          </Select.Option>
        )
      })}
    </Select>
  )
}

export default SourceMintSelect

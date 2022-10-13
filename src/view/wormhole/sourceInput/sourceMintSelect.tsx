import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useWalletBalance } from '@sentre/senhub'
import { account, utils } from '@senswap/sen-js'
import { CHAIN_ID_SOLANA } from '@certusone/wormhole-sdk'

import { Space, Select, Divider, Typography, Avatar } from 'antd'

import { AppDispatch, AppState } from 'model'
import { util } from '@sentre/senhub'
import { updateSolTokens, setSourceToken } from 'model/wormhole.controller'
import { SOL_ADDRESS } from 'lib/stat/constants/sol'
import { web3Http } from 'lib/etherWallet/web3Config'
import { ETH_ADDRESS } from 'lib/wormhole/constant/ethConfig'
import { getEtherNetwork } from 'lib/wormhole/helper/utils'

const SourceMintSelect = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    wormhole: { sourceTokens, sourceWalletAddress, tokenAddress, sourceChain },
  } = useSelector((state: AppState) => state)
  const lamports = useWalletBalance()

  const onChange = (tokenAddress: string) =>
    dispatch(setSourceToken({ tokenAddress }))

  useEffect(() => {
    ;(async () => {
      const solBalance = utils.undecimalize(BigInt(lamports), 9)
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
      await dispatch(updateSolTokens({ sourceTokens: cloneSourceToken }))
    })()
  }, [dispatch, lamports, sourceChain, sourceTokens])

  useEffect(() => {
    ;(async () => {
      if (!sourceWalletAddress || account.isAddress(sourceWalletAddress)) {
        return
      }
      const ethBalance = await web3Http.eth.getBalance(
        web3Http.utils.toChecksumAddress(sourceWalletAddress),
      )
      const ethAddress = ETH_ADDRESS[getEtherNetwork()]
      if (!!sourceTokens[ethAddress] || !ethBalance) return
      const cloneSourceToken = JSON.parse(JSON.stringify(sourceTokens))

      cloneSourceToken[ethAddress] = {
        address: ethAddress,
        amount: Number(utils.undecimalize(BigInt(ethBalance), 18)),
        balance: `${ethBalance}`,
        decimals: 18,
        logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/FeGn77dhg1KXRRFeSwwMiykZnZPw5JXW6naf2aQgZDQf/logo.png',
        name: 'Eth nav',
        symbol: 'ETH',
      }
      await dispatch(updateSolTokens({ sourceTokens: cloneSourceToken }))
    })()
  }, [dispatch, sourceChain, sourceTokens, sourceWalletAddress])

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
                  background: util.randomColor(token.address, 0.8),
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

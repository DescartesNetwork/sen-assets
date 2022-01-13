import { useCallback, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { account } from '@senswap/sen-js'

import { Space, Select, Divider, Typography, Avatar } from 'antd'

import { AppDispatch, AppState } from 'app/model'
import { randomColor } from 'shared/util'
import { setSourceToken } from 'app/model/wormhole.controller'
import {
  fetchForeignAssetEtherFromSol,
  compareHexAddress,
} from 'app/lib/wormhole/helper/ether'

const SourceMintSelect = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    wormhole: { sourceTokens, sourceWalletAddress, tokenAddress },
  } = useSelector((state: AppState) => state)
  const query = new URLSearchParams(useLocation().search)
  const tokenFromSwap = query.get('tokenAddress') || ''

  const ethTokens = useMemo(() => {
    return Object.keys(sourceTokens)
  }, [sourceTokens])

  const onChange = (tokenAddress: string) =>
    dispatch(setSourceToken({ tokenAddress }))

  const fetchToken = useCallback(async () => {
    if (
      !account.isAddress(tokenFromSwap) ||
      !sourceWalletAddress ||
      !ethTokens.length
    )
      return

    const ethTokenFromSol = await fetchForeignAssetEtherFromSol(tokenFromSwap)
    for (const token of ethTokens) {
      if (compareHexAddress(ethTokenFromSol, token)) {
        dispatch(setSourceToken({ tokenAddress: token }))
        break
      }
    }
  }, [dispatch, ethTokens, sourceWalletAddress, tokenFromSwap])

  useEffect(() => {
    fetchToken()
  }, [fetchToken])

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
                {token.symbol.substring(0, 2)}
              </Avatar>
              <Space direction="vertical" size={0}>
                <Typography.Text style={{ color: '#7A7B85' }}>
                  {token.symbol}
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

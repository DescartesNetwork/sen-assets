import { Space, Select, Divider, Typography, Avatar } from 'antd'
import { useDispatch, useSelector } from 'react-redux'

import { AppState } from 'app/model'
import { randomColor } from 'shared/util'
import { setSourceToken } from 'app/model/wormhole.controller'

const SourceMintSelect = () => {
  const dispatch = useDispatch()
  const { sourceTokens, sourceWalletAddress, tokenAddress } = useSelector(
    (state: AppState) => state.wormhole,
  )
  const onChange = (tokenAddress: string) =>
    dispatch(setSourceToken({ tokenAddress }))

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

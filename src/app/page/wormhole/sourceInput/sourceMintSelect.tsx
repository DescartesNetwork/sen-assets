import { Space, Select, Divider, Typography, Avatar } from 'antd'
import { useDispatch, useSelector } from 'react-redux'

import { AppDispatch, AppState } from 'app/model'
import { randomColor } from 'shared/util'
import { setSourceToken } from 'app/model/wormhole.controller'

const SourceMintSelect = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    wormhole: { sourceTokens, sourceWalletAddress, tokenAddress },
  } = useSelector((state: AppState) => state)
  const onChange = (tokenAddress: string) =>
    dispatch(setSourceToken({ tokenAddress }))

  console.log(sourceTokens, 'ngieueueu')

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

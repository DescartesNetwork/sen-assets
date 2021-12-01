import { Space, Select, Divider, Typography } from 'antd'
import { MintAvatar, MintSymbol } from 'app/shared/components/mint'
import IonIcon from 'shared/ionicon'

const SelectMint = ({
  value,
  onSelectMint,
}: {
  value?: string
  onSelectMint?: (mintAddress: string) => void
}) => {
  return (
    <Select
      onChange={onSelectMint}
      value={value}
      bordered={false}
      suffixIcon={<Divider type="vertical" style={{ margin: 0 }} />}
      size="middle"
      style={{ marginLeft: -12 }}
    >
      <Select.Option value={'Select'}>
        <Space align="center">
          <MintAvatar
            size={24}
            mintAddress={'Select'}
            icon={<IonIcon name="help-outline" />}
          />
          <Space direction="vertical" size={0}>
            <Typography.Text style={{ color: '#7A7B85' }}>
              <MintSymbol mintAddress={''} />
            </Typography.Text>
          </Space>
        </Space>
      </Select.Option>
    </Select>
  )
}

export default SelectMint

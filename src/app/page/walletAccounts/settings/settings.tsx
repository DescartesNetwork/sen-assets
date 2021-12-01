import { useDispatch, useSelector } from 'react-redux'

import { Row, Col, Button, Space, Popover, Typography, Switch } from 'antd'
import IonIcon from 'shared/ionicon'

import { AppState } from 'app/model'
import {
  setHiddenUnknownTokens,
  setHiddenZeros,
} from 'app/model/settings.controller'

const Settings = () => {
  const dispatch = useDispatch()
  const settings = useSelector((state: AppState) => state.settings)
  const { hiddenZeros, hiddenUnknownTokens } = settings

  return (
    <Popover
      zIndex={1000}
      content={
        <Row gutter={[8, 8]} style={{ maxWidth: 224 }}>
          <Col span={24}>
            <Space size="large">
              <Switch
                size="small"
                checked={hiddenZeros}
                onChange={(checked) => dispatch(setHiddenZeros({ checked }))}
              />
              <Typography.Text>Hide zero balances</Typography.Text>
            </Space>
          </Col>
          <Col span={24}>
            <Space size="large">
              <Switch
                size="small"
                checked={hiddenUnknownTokens}
                onChange={(checked) =>
                  dispatch(setHiddenUnknownTokens({ checked }))
                }
              />
              <Typography.Text>Hide unknown tokens</Typography.Text>
            </Space>
          </Col>
        </Row>
      }
      trigger="click"
      placement="topRight"
    >
      <Button
        type="text"
        shape="circle"
        style={{ minWidth: 'unset', width: 'auto' }}
        icon={<IonIcon name="cog-outline" />}
      />
    </Popover>
  )
}
export default Settings

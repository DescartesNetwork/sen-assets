import { useDispatch, useSelector } from 'react-redux'

import { Row, Col, Button, Space, Popover, Typography, Switch } from 'antd'

import { AppState } from 'app/model'
import {
  setHiddenUnknownTokens,
  setHiddenZeros,
} from 'app/model/settings.controller'
import IonIcon from 'shared/ionicon'

const Settings = () => {
  const dispatch = useDispatch()
  const { hiddenZeros, hiddenUnknownTokens } = useSelector(
    (state: AppState) => state.settings,
  )

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
        icon={<IonIcon name="cog-outline" />}
      />
    </Popover>
  )
}
export default Settings

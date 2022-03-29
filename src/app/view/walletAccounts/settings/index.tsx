import { useDispatch, useSelector } from 'react-redux'

import { Row, Col, Space, Popover, Typography, Switch } from 'antd'
import IonIcon from 'shared/antd/ionicon'
import ImportToken from './importToken'

import { AppDispatch, AppState } from 'app/model'
import {
  setHiddenUnknownTokens,
  setHiddenZeros,
} from 'app/model/settings.controller'

const Settings = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    settings: { hiddenZeros, hiddenUnknownTokens },
  } = useSelector((state: AppState) => state)

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
          <Col span={24}>
            <ImportToken />
          </Col>
        </Row>
      }
      trigger="click"
      placement="topRight"
    >
      <IonIcon style={{ cursor: 'pointer' }} name="cog-outline" />
    </Popover>
  )
}
export default Settings

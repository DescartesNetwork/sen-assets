import { useDispatch, useSelector } from 'react-redux'

import { Row, Col, Space, Popover, Typography, Switch, Button } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

import { AppDispatch, AppState } from 'app/model'
import { setGroupByNftCollection } from 'app/model/settings.controller'

const Settings = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    settings: { groupByNftCollection },
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
                checked={groupByNftCollection}
                onChange={(checked) =>
                  dispatch(setGroupByNftCollection({ checked }))
                }
              />
              <Typography.Text>Group By NFT Collection</Typography.Text>
            </Space>
          </Col>
        </Row>
      }
      trigger="click"
      placement="topRight"
    >
      <Button
        size="large"
        icon={<IonIcon style={{ cursor: 'pointer' }} name="cog-outline" />}
      />
    </Popover>
  )
}
export default Settings

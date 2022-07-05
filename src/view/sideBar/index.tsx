import { useHistory, useLocation } from 'react-router-dom'
import { useMemo } from 'react'

import {
  Avatar,
  Card,
  Col,
  Menu,
  MenuProps,
  Row,
  Space,
  Typography,
} from 'antd'
import { MENU_LIST } from 'helper/menuList'
import CardCleanUp from './cardCleanUp'
import configs from 'configs'

import Logo from 'static/images/logo.svg'

const {
  manifest: { appId },
} = configs
const appPath = '/app/' + appId

const SideBar = () => {
  const location = useLocation()
  const history = useHistory()

  const onSelect: MenuProps['onClick'] = (e) => {
    history.push(e.key)
  }

  const selectedKey = useMemo(() => {
    const key = location.pathname.replace(`${appPath}/`, '')
    const indexOf = key.indexOf('/')
    if (indexOf === -1) return location.pathname
    return `${appPath}/${key.slice(0, indexOf)}`
  }, [location.pathname])

  return (
    <Card
      bordered={false}
      style={{ height: '100%', boxShadow: 'none' }}
      bodyStyle={{ height: '100%' }}
      className="sidebar-card card-sen-assets"
    >
      <Row gutter={[24, 24]} style={{ height: '100%' }} justify="space-between">
        <Col
          span={24}
          className="scrollbar"
          style={{ height: '60%', overflow: 'auto' }}
        >
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Space size={12}>
                <Avatar shape="square" size={24} src={Logo} />
                <Typography.Title level={5}>Sen Assets</Typography.Title>
              </Space>
            </Col>
            <Col span={24}>
              <Menu
                mode="inline"
                style={{ border: 'none', fontSize: '16px' }}
                selectedKeys={[selectedKey]}
                className="sidebar-menu"
                items={MENU_LIST}
                onClick={onSelect}
              />
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row style={{ height: '100%' }} align="bottom">
            <CardCleanUp />
          </Row>
        </Col>
      </Row>
    </Card>
  )
}

export default SideBar

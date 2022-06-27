import { useHistory, useLocation } from 'react-router-dom'
import { useMemo } from 'react'

import { Card, Col, Menu, MenuProps, Row } from 'antd'
import { MENU_LIST } from 'app/helper/menuList'
import CardCleanUp from './cardCleanUp'
import configs from 'app/configs'

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
        <Col span={24} style={{ height: '60%', overflow: 'auto' }}>
          <Menu
            mode="inline"
            style={{ border: 'none', fontSize: '16px' }}
            selectedKeys={[selectedKey]}
            className="sidebar-menu"
            items={MENU_LIST}
            onClick={onSelect}
          />
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

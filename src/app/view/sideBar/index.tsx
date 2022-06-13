import { Link, useLocation } from 'react-router-dom'

import { Card, Col, Menu, Row } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import { menuList } from 'app/helper/menuList'

const SideBar = () => {
  const location = useLocation()

  return (
    <Row gutter={[24, 24]} style={{ height: '100%' }}>
      <Col span={24}>
        <Card bordered={false} style={{ height: '100%' }}>
          <Menu
            mode="inline"
            style={{ border: 'none', fontSize: '16px' }}
            defaultSelectedKeys={[location.pathname]}
          >
            {menuList.map((item) => (
              <Menu.Item style={{ padding: '24px' }} key={item.path}>
                <Link to={item.path}>
                  <IonIcon name={item.icon} style={{ fontSize: '18px' }} />
                  <span>{item.name}</span>
                </Link>
              </Menu.Item>
            ))}
          </Menu>
        </Card>
      </Col>
    </Row>
  )
}

export default SideBar

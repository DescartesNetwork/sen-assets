import { Link, useLocation } from 'react-router-dom'

import { Card, Col, Menu, Row } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import { menuList } from 'app/helper/menuList'
import CardCleanUp from './cardCleanUp'

const SideBar = () => {
  const location = useLocation()

  return (
    <Card
      bordered={false}
      style={{ height: '100%' }}
      bodyStyle={{ height: '100%' }}
      className="card-sen-assets"
    >
      <Row gutter={[24, 24]} style={{ height: '100%' }} justify="space-between">
        <Col span={24}>
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

import IonIcon from '@sentre/antd-ionicon'
import { Row, Col, Space, Button, Divider, Typography } from 'antd'
import React from 'react'

type LogoProps = {
  name?: string
}

const Logo = ({ name }: LogoProps) => {
  return (
    <Row>
      <Col flex="auto">
        <Typography.Text type="danger">{name}</Typography.Text>
      </Col>
      <Col>
        <Space size={0}>
          <Button type="text" icon={<IonIcon name="logo-telegram" />} />
          <Button type="text" icon={<IonIcon name="logo-twitter" />} />
          <Divider type="vertical" />
          <Button type="text" icon={<IonIcon name="copy-outline" />} />
        </Space>
      </Col>
    </Row>
  )
}

export default Logo

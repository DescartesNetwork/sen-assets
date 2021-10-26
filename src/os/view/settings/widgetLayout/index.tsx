import { useDndContext } from '@dnd-kit/core'

import { Row, Col, Avatar } from 'antd'
import { StaticLoader } from 'os/components/appLoader'

import manifest from 'senhub.manifest'
import IonIcon from 'shared/ionicon'

const WidgetLayout = () => {
  const dndContext = useDndContext()
  console.log(dndContext)

  return (
    <Row gutter={[24, 24]}>
      {Object.keys(manifest).map((appId, i) => (
        <Col key={appId + i}>
          <StaticLoader
            type="logo"
            {...manifest[appId]}
            render={(url) => (
              <Avatar src={url} shape="square" size={64}>
                <IonIcon name="image-outline" />
              </Avatar>
            )}
          />
        </Col>
      ))}
    </Row>
  )
}

export default WidgetLayout
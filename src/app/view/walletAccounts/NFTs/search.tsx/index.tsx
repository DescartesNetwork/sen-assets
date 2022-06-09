import { useState } from 'react'
import { Row, Col, Input, Button } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

const Search = () => {
  const [keyword, setKeyword] = useState('')
  return (
    <Row gutter={[16, 16]}>
      <Col flex="auto">
        <Input
          placeholder="Search"
          value={keyword}
          size="large"
          style={{ background: 'transparent' }}
          prefix={
            <Button
              type="text"
              style={{ marginLeft: -7 }}
              size="small"
              onClick={keyword ? () => setKeyword('') : () => {}}
              icon={
                <IonIcon name={keyword ? 'close-outline' : 'search-outline'} />
              }
            />
          }
          onChange={(e) => setKeyword(e.target.value)}
        />
      </Col>
      <Col>
        <Button
          type="primary"
          size="large"
          icon={<IonIcon name="paper-plane-outline" />}
          style={{ fontSize: 18 }}
        >
          Send
        </Button>
      </Col>
    </Row>
  )
}

export default Search

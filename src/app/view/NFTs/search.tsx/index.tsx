import { useState } from 'react'
import { Row, Col, Input, Button } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import ModalSendMultiNFTs from '../modalSendNFT/modalSendMultiNFTs'

const Search = () => {
  const [keyword, setKeyword] = useState('')
  return (
    <Row gutter={[16, 16]}>
      <Col flex="1 0">
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
        <ModalSendMultiNFTs isMultiSelect={true} />
      </Col>
    </Row>
  )
}

export default Search

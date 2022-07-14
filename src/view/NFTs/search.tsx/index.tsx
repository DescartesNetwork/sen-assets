import { Row, Col, Input, Button } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import ModalSendMultiNFTs from '../modalSendNFT/modalSendMultiNFTs'
import { useUI } from '@sentre/senhub'
import Settings from '../settings'

type SearchProps = {
  onSearch: (keyword: string) => void
  searchText: string
}

const Search = ({ onSearch, searchText }: SearchProps) => {
  const {
    ui: { width },
  } = useUI()
  const isMobile = width < 992

  return (
    <Row gutter={[8, 8]} wrap={false}>
      <Col flex="1 0">
        <Input
          className="search-assets"
          placeholder="Search"
          size="large"
          style={{ minWidth: isMobile ? undefined : 296 }}
          value={searchText}
          prefix={
            <Button
              type="text"
              style={{ marginLeft: -7 }}
              size="small"
              onClick={searchText ? () => onSearch('') : () => {}}
              icon={
                <IonIcon
                  name={searchText ? 'close-outline' : 'search-outline'}
                />
              }
            />
          }
          onChange={(e) => onSearch(e.target.value)}
        />
      </Col>
      <Col>
        <Settings />
      </Col>
      <Col>
        <ModalSendMultiNFTs />
      </Col>
    </Row>
  )
}

export default Search

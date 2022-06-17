import { useMemo } from 'react'
import { useWallet } from '@senhub/providers'
import { useHistory } from 'react-router-dom'

import { Col, Empty, Row } from 'antd'
import useOwnerNFT from 'app/hooks/useOwnerNFT'

import CardNFT from '../cardNFT'
import configs from 'app/configs'
import SearchEngine from './searchEngine'

type ListNFTsProps = {
  searchText: string
}
const {
  manifest: { appId },
} = configs
const nftPath = '/app/' + appId + '/nft-asset'

const ListNFTs = ({ searchText }: ListNFTsProps) => {
  const {
    wallet: { address: walletAddress },
  } = useWallet()
  const { nfts } = useOwnerNFT(walletAddress)
  const history = useHistory()

  const onSelectNFT = (mintAddress: string) => {
    history.push(`${nftPath}/${mintAddress}`)
  }

  const filteredList = useMemo(() => {
    if (!nfts) return []
    if (!searchText.length) return nfts
    const engine = new SearchEngine(nfts)
    const filtered = engine.search(searchText)
    return filtered
  }, [nfts, searchText])

  return (
    <Row gutter={[24, 24]} className="scrollbar" style={{ height: 400 }}>
      {filteredList?.length ? (
        filteredList.map((nft) => (
          <Col xs={12} md={6} style={{ textAlign: 'center' }} key={nft.mint}>
            <CardNFT mintAddress={nft.mint} onSelect={onSelectNFT} />
          </Col>
        ))
      ) : (
        <Col span={24} style={{ textAlign: 'center' }}>
          <Empty style={{ padding: 40 }} />
        </Col>
      )}
    </Row>
  )
}

export default ListNFTs

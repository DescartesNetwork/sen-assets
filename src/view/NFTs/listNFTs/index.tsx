import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useWallet } from '@sentre/senhub'
import { useHistory } from 'react-router-dom'
import LazyLoad from '@sentre/react-lazyload'

import { Card, Col, Empty, Row } from 'antd'
import CardNFT from '../cardNFT'
import SearchEngine from './searchEngine'
import useOwnerNftByCollection from 'hooks/useOwnerNftByCollection'

import { AppState } from 'model'
import configs from 'configs'

type ListNFTsProps = {
  searchText: string
}
const {
  manifest: { appId },
} = configs
const nftPath = '/app/' + appId + '/nfts-asset'

const ListNFTs = ({ searchText }: ListNFTsProps) => {
  const {
    wallet: { address: walletAddress },
  } = useWallet()
  const { nftsSortByCollection: nfts } = useOwnerNftByCollection(walletAddress)
  const [listNFTsUnknown, setListNFTsUnknown] = useState<
    Record<string, boolean>
  >({})
  const {
    settings: { hiddenUnknownNFTs },
  } = useSelector((state: AppState) => state)
  const history = useHistory()

  const onSelectNFT = (mintAddress: string) => {
    history.push(`${nftPath}/${mintAddress}`)
  }

  const addUnknownNFT = (mintNFT: string) => {
    if (listNFTsUnknown[mintNFT]) return
    const nftsUnknown = Object.assign(listNFTsUnknown, {
      [mintNFT]: true,
    })
    setListNFTsUnknown(JSON.parse(JSON.stringify(nftsUnknown)))
  }

  const filteredList = useMemo(() => {
    if (!nfts) return []

    let nftsCheckCondition = nfts
    if (hiddenUnknownNFTs)
      nftsCheckCondition = nfts.filter((nft) => !listNFTsUnknown[nft.mint])
    if (!searchText.length) return nftsCheckCondition

    const engine = new SearchEngine(nftsCheckCondition)
    const filtered = engine.search(searchText)
    return filtered
  }, [hiddenUnknownNFTs, listNFTsUnknown, nfts, searchText])

  return (
    <Row gutter={[24, 24]}>
      {filteredList?.length ? (
        filteredList.map((nft) => (
          <Col xs={12} md={6} style={{ textAlign: 'center' }} key={nft.mint}>
            <Card className="card-nft" bordered={false}>
              <LazyLoad height={100} offset={150} overflow>
                <CardNFT
                  mintAddress={nft.mint}
                  onSelect={onSelectNFT}
                  addUnknownNFT={addUnknownNFT}
                />
              </LazyLoad>
            </Card>
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

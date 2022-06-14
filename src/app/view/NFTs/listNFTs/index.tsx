import { useHistory } from 'react-router-dom'
import LazyLoad from '@sentre/react-lazyload'

import { Row, Col, Empty } from 'antd'
import CardNFT from '../cardNFT'

import useOwnerNFT from 'app/hooks/useOwnerNFT'
import { useWallet } from '@senhub/providers'
import configs from 'app/configs'

const {
  manifest: { appId },
} = configs
const nftPath = '/app/' + appId + '/nft-asset'

const ListNFTs = () => {
  const {
    wallet: { address: walletAddress },
  } = useWallet()
  const { nfts } = useOwnerNFT(walletAddress)
  const history = useHistory()
  const onSelectNFT = (mintAddress: string) => {
    history.push(`${nftPath}/${mintAddress}`)
  }
  return (
    <Row gutter={[24, 24]} className="scrollbar" style={{ height: 400 }}>
      {nfts?.length ? (
        nfts.map((nft) => (
          <Col xs={12} md={6} style={{ textAlign: 'center' }} key={nft.mint}>
            <LazyLoad height={100}>
              <CardNFT mintAddress={nft.mint} onSelect={onSelectNFT} />
            </LazyLoad>
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

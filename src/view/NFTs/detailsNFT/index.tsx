import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAccount, useWallet } from '@sentre/senhub'

import { Row, Col, Card, Typography } from 'antd'
import CardNFT from '../cardNFT'
import Back from './back'
import CardAttributes from './cardAttributes'
import CardDescription from './cardDescription'
import useNftMetaData from 'hooks/useNftMetaData'
import Logo from './logo'
import ModalSendOneNFT from '../modalSendNFT/modalSendOneNFT'
import PageNotFound from 'components/pageNotFound'

const DetailsNFT = () => {
  let { mintNFT } = useParams<{ mintNFT: string }>()
  const { nftInfo, loading } = useNftMetaData(mintNFT)
  const [isShowSendBtn, setIsShowSendBtn] = useState(false)

  const { accounts } = useAccount()
  const {
    wallet: { address: walletAddress },
  } = useWallet()

  const checkIsHasNFT = useCallback(async () => {
    const { splt } = window.sentre
    const nftTokenAccount = await splt.deriveAssociatedAddress(
      walletAddress,
      mintNFT,
    )
    if (
      accounts[nftTokenAccount] &&
      Number(accounts[nftTokenAccount].amount.toString()) === 1
    )
      return setIsShowSendBtn(true)

    return setIsShowSendBtn(false)
  }, [accounts, mintNFT, walletAddress])

  useEffect(() => {
    checkIsHasNFT()
  }, [checkIsHasNFT])
  if (!nftInfo && !loading) return <PageNotFound />

  return (
    <Row gutter={[16, 16]} justify="center" align="middle">
      <Col span={24}>
        <Back />
      </Col>
      <Col span={24}>
        <Card className="card-sen-assets scrollbar">
          <Row gutter={[24, 24]} justify="center">
            <Col xs={24} md={6}>
              <CardNFT mintAddress={mintNFT} isShowName={false} />
            </Col>
            <Col xs={24} md={18}>
              <Row gutter={[8, 8]}>
                <Col flex="auto">
                  <Typography.Title level={3}>{nftInfo?.name}</Typography.Title>
                </Col>
                <Col>
                  {isShowSendBtn && <ModalSendOneNFT mintNFT={mintNFT} />}
                </Col>
                <Col span={24}>
                  <Logo name={nftInfo?.name} mintAddress={mintNFT} />
                </Col>
                <Col span={24}>
                  <CardAttributes mintNFT={mintNFT} />
                </Col>
                <Col span={24}>
                  <CardDescription mintNFT={mintNFT} />
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  )
}

export default DetailsNFT

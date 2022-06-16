import { ChangeEvent, Fragment, useEffect, useState } from 'react'
import { isAddress } from '@sentre/utility'
import BN from 'bn.js'

import { Button, Col, Input, Modal, Row, Typography } from 'antd'
import CardSendNFT from './cardSendNFT'
import configs from 'app/configs'
import { explorer } from 'shared/util'
import IonIcon from '@sentre/antd-ionicon'
import useOwnerNFT from 'app/hooks/useOwnerNFT'
import { useWallet } from '@senhub/providers'

const {
  sol: { utility },
} = configs

type ModalSendNFTProps = {
  isMultiSelect: boolean
  mintNFT?: string
}

const SendMultiNFTs = ({
  isMultiSelect = false,
  mintNFT = '',
}: ModalSendNFTProps) => {
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [receiverAddress, setReceiverAddress] = useState('')
  const [listNFTsSelected, setListNFTsSelected] = useState<
    Record<string, boolean>
  >({})

  const {
    wallet: { address: walletAddress },
  } = useWallet()
  const { nfts } = useOwnerNFT(walletAddress)
  const onCloseModal = () => {
    setVisible(false)
  }
  const onSend = async () => {
    if (!isAddress(receiverAddress))
      return window.notify({
        type: 'error',
        description: 'Invalid mint address',
      })

    console.log('mintNFT', listNFTsSelected)
    for (const mintNFT in listNFTsSelected) {
      if (!listNFTsSelected[mintNFT]) continue
      setLoading(true)
      console.log('send tx')
      try {
        const { txId } = await utility.safeTransfer({
          amount: new BN(1),
          tokenAddress: mintNFT,
          dstWalletAddress: receiverAddress,
        })
        setListNFTsSelected(
          Object.assign(listNFTsSelected, { [mintNFT]: false }),
        )
        window.notify({
          type: 'success',
          description: 'Transfer success!',
          onClick: () => window.open(explorer(txId), '_blank'),
        })
      } catch (er: any) {
        window.notify({ type: 'error', description: er.message })
      } finally {
        console.log(listNFTsSelected)
        setLoading(false)
      }
    }
  }

  const onChooseNFT = (mintAddress: string, isChecked: boolean) => {
    setListNFTsSelected(
      Object.assign(listNFTsSelected, { [mintAddress]: isChecked }),
    )
  }

  return (
    <Fragment>
      <Button
        type="primary"
        size="large"
        icon={<IonIcon name="paper-plane-outline" />}
        onClick={() => setVisible(true)}
      >
        Send
      </Button>

      <Modal visible={visible} footer={false} onCancel={onCloseModal}>
        <Row gutter={[8, 8]}>
          <Col span={24}>
            <Typography.Title level={4}>Send NFT</Typography.Title>
          </Col>
          <Col span={24}>
            <Typography.Text>Receiver Address</Typography.Text>
          </Col>
          <Col span={24}>
            <Input
              size="large"
              placeholder="Recipient’s wallet address..."
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setReceiverAddress(e.target.value)
              }}
            />
          </Col>
          <Col span={24} style={{ textAlign: 'center' }}>
            <Typography.Text>You have selected 1 NFT</Typography.Text>
          </Col>
          <Col span={24}>
            <Row
              gutter={[8, 8]}
              className="scrollbar"
              style={{ maxHeight: 400, padding: 20 }}
            >
              {nfts?.map((nft) => (
                <Col span={24} key={nft.mint}>
                  <CardSendNFT
                    mintNFT={nft.mint}
                    isSendOneNFT={false}
                    onSelect={onChooseNFT}
                    isChecked={listNFTsSelected[nft.mint]}
                  />
                </Col>
              ))}
            </Row>
          </Col>
          <Col span={24}>
            <Button type="primary" block onClick={onSend} loading={loading}>
              Send
            </Button>
          </Col>
        </Row>
      </Modal>
    </Fragment>
  )
}

export default SendMultiNFTs

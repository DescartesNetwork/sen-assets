import { Row, Col, Checkbox, Space, Typography } from 'antd'
import { CheckboxChangeEvent } from 'antd/lib/checkbox'
import CardNFT from '../cardNFT'
import Address from '../cardNFT/address'

import useNftMetaData from 'hooks/useNftMetaData'

type CardSendNFTProps = {
  mintNFT: string
  isSendOneNFT?: boolean
  onSelect?: (mintAddress: string, isChecked: boolean) => void
  isChecked?: boolean
}

const CardSendNFT = ({
  mintNFT,
  isSendOneNFT = true,
  onSelect,
  isChecked = false,
}: CardSendNFTProps) => {
  const { nftInfo } = useNftMetaData(mintNFT)

  const onChange = (e: CheckboxChangeEvent) => {
    if (onSelect) onSelect(mintNFT, e.target.checked)
  }

  return (
    <Row gutter={[24, 24]} align="middle">
      {!isSendOneNFT && (
        <Col>
          <Checkbox checked={isChecked} onChange={onChange} />
        </Col>
      )}
      <Col>
        <CardNFT mintAddress={mintNFT} size={64} isShowName={false} />
      </Col>
      <Col flex="auto">
        <Space size={4} direction="vertical">
          <Typography.Text>{nftInfo?.symbol || ''}</Typography.Text>
          <Typography.Text type="danger">{nftInfo?.name || ''}</Typography.Text>
        </Space>
      </Col>
      <Col>
        <Address address={mintNFT} />
      </Col>
    </Row>
  )
}

export default CardSendNFT

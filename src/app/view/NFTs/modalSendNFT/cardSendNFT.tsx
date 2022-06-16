import { useState } from 'react'

import { Row, Col, Checkbox, Space, Typography } from 'antd'
import { asyncWait, shortenAddress } from 'shared/util'
import CardNFT from '../cardNFT'
import useNftMetaData from 'app/hooks/useNftMetaData'
import { CheckboxChangeEvent } from 'antd/lib/checkbox'

const Address = ({ address }: { address: string }) => {
  const [copied, setCopied] = useState(false)

  const onCopy = async () => {
    setCopied(true)
    await asyncWait(1500)
    setCopied(false)
  }

  return (
    <Space>
      <Typography.Text className="t-16">
        {shortenAddress(address)}
      </Typography.Text>
      {/* <Tooltip title="Copied" visible={copied}>
          <CopyToClipboard text={address} onCopy={onCopy}>
            <Typography.Text style={{ cursor: 'pointer' }} className="t-16">
              <IonIcon name="copy-outline" />
            </Typography.Text>
          </CopyToClipboard>
        </Tooltip> */}
    </Space>
  )
}

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

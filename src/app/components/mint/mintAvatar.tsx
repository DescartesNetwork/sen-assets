import { ReactNode } from 'react'

import { Avatar } from 'antd'
import IonIcon from 'shared/antd/ionicon'

import useTokenProvider from 'app/hooks/useTokenProvider'

const MintAvatar = ({
  mintAddress,
  size = 24,
  icon = <IonIcon name="diamond-outline" />,
}: {
  mintAddress: string
  size?: number
  icon?: ReactNode
}) => {
  const tokens = useTokenProvider(mintAddress)
  return (
    <Avatar.Group style={{ display: 'block', whiteSpace: 'nowrap' }}>
      {tokens.map((token, i) => (
        <Avatar
          key={token?.address || i}
          src={token?.logoURI}
          size={size}
          style={{ backgroundColor: '#2D3355', border: 'none' }}
        >
          {icon}
        </Avatar>
      ))}
    </Avatar.Group>
  )
}

export default MintAvatar

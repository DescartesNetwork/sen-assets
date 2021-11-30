import { ReactNode, useCallback, useEffect, useState } from 'react'

import { Avatar } from 'antd'
import { useMint, usePool } from 'senhub/providers'
import IonIcon from 'shared/ionicon'

const MintAvatar = ({
  mintAddress,
  size = 24,
  icon = <IonIcon name="diamond-outline" />,
}: {
  mintAddress: string
  size?: number
  icon?: ReactNode
}) => {
  const { pools } = usePool()
  const { tokenProvider } = useMint()
  const [logoURIs, setLogoURIs] = useState<(string | undefined)[]>([])

  const getLogoURIs = useCallback(async () => {
    // Normal mint
    const token = await tokenProvider.findByAddress(mintAddress)
    if (token) return setLogoURIs([token?.logoURI])
    // LP mint
    const poolData = Object.values(pools).find(
      ({ mint_lpt }) => mint_lpt === mintAddress,
    )
    if (!poolData) return setLogoURIs([undefined])
    const { mint_a, mint_b } = poolData
    const tokenA = await tokenProvider.findByAddress(mint_a)
    const tokenB = await tokenProvider.findByAddress(mint_b)
    return setLogoURIs([tokenA?.logoURI, tokenB?.logoURI])
  }, [mintAddress, pools, tokenProvider])

  useEffect(() => {
    getLogoURIs()
  }, [getLogoURIs])

  return (
    <Avatar.Group style={{ display: 'block' }}>
      {logoURIs.map((logoURI, i) => (
        <Avatar
          key={i}
          src={logoURI}
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

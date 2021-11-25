import { Avatar } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { useMint, usePool } from 'senhub/providers'
import IonIcon from 'shared/ionicon'

const MintAvatar = ({
  mintAddress,
  size = 24,
}: {
  mintAddress: string
  size?: number
}) => {
  const { pools } = usePool()
  const { tokenProvider } = useMint()
  const [logoURIs, setLogoURIs] = useState<(string | undefined)[]>([])

  const getLogoURIs = useCallback(async () => {
    // Normal mint
    const { logoURI } = (await tokenProvider.findByAddress(mintAddress)) || {}
    if (logoURI) return setLogoURIs([logoURI])
    // LP mint
    const poolData = Object.values(pools).find(
      ({ mint_lpt }) => mint_lpt === mintAddress,
    )
    if (poolData) {
      const { mint_a, mint_b } = poolData
      const { logoURI: logoURIA } =
        (await tokenProvider.findByAddress(mint_a)) || {}
      const { logoURI: logoURIB } =
        (await tokenProvider.findByAddress(mint_b)) || {}
      return setLogoURIs([logoURIA, logoURIB])
    }
    // Unknown mint
    return setLogoURIs([undefined])
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
          <IonIcon name="diamond-outline" />
        </Avatar>
      ))}
    </Avatar.Group>
  )
}

export default MintAvatar

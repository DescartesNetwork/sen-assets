import { useCallback, useEffect, useState } from 'react'
import { useMint } from 'senhub/providers'

const useMintDecimals = (mintAddress: string): number => {
  const [decimals, setDecimals] = useState(0)
  const { tokenProvider, getMint } = useMint()

  const fetchTokenDecimals = useCallback(async () => {
    //Find in token provider
    const token = await tokenProvider.findByAddress(mintAddress)
    if (token) return setDecimals(token.decimals)

    //Find on blockchain (slow than token provider)
    const mint = await getMint({ address: mintAddress })
    setDecimals(mint[mintAddress].decimals)
  }, [getMint, mintAddress, tokenProvider])

  useEffect(() => {
    fetchTokenDecimals()
  }, [fetchTokenDecimals])

  return decimals
}
export default useMintDecimals

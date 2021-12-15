import { useCallback, useEffect, useState } from 'react'

import { useMint, usePool } from 'senhub/providers'
import { LPT_DECIMALS } from 'app/constant/sol'

const useMintDecimals = (mintAddress: string): number => {
  const [decimals, setDecimals] = useState(0)
  const { tokenProvider, getMint } = useMint()
  const { pools } = usePool()

  const fetchTokenDecimals = useCallback(async () => {
    if (!mintAddress) return setDecimals(0)
    // Find in token provider
    const token = await tokenProvider.findByAddress(mintAddress)
    if (token) return setDecimals(token.decimals)
    // LPT
    for (const poolAddr in pools) {
      const { mint_lpt } = pools[poolAddr]
      if (mint_lpt === mintAddress) return setDecimals(LPT_DECIMALS)
    }
    // Find on blockchain (slow than token provider)
    try {
      const mint = await getMint({ address: mintAddress })
      return setDecimals(mint[mintAddress].decimals)
    } catch (error) {
      return setDecimals(0)
    }
  }, [getMint, mintAddress, pools, tokenProvider])

  useEffect(() => {
    fetchTokenDecimals()
  }, [fetchTokenDecimals])

  return decimals
}

export default useMintDecimals

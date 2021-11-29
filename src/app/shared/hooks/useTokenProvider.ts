import { TokenInfo } from '@solana/spl-token-registry'
import { useCallback, useEffect, useState } from 'react'
import { useMint } from 'senhub/providers'

const useTokenProvider = (mintAddress: string) => {
  const { tokenProvider } = useMint()
  const [tokenInfo, setTokenInfo] = useState<TokenInfo>()

  const fetchTokenInfo = useCallback(async () => {
    const token = await tokenProvider.findByAddress(mintAddress)
    if (!token) return setTokenInfo(undefined)
    return setTokenInfo(token)
  }, [mintAddress, tokenProvider])

  useEffect(() => {
    fetchTokenInfo()
  }, [fetchTokenInfo])

  return tokenInfo
}
export default useTokenProvider

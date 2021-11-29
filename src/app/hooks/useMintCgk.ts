import { useCallback, useEffect, useState } from 'react'
import { useMint } from 'senhub/providers'
import { fetchCGK } from 'shared/helper'

const useMintCgk = (mintAddress: string): CgkData => {
  const [cgkData, setCgkData] = useState<CgkData>({
    address: mintAddress,
    icon: '',
    name: 'TOKEN',
    price: 0,
    priceChange: 0,
    rank: 0,
    symbol: 'TOKEN',
    totalVolume: 0,
  })
  const { tokenProvider } = useMint()

  const fetchCgkData = useCallback(async () => {
    const token = await tokenProvider.findByAddress(mintAddress)
    if (!token) return
    const ticket = token.extensions?.coingeckoId
    if (!ticket) return
    const cgkData = await fetchCGK(ticket)
    if (!cgkData) return
    return setCgkData(cgkData)
  }, [mintAddress, tokenProvider])

  useEffect(() => {
    fetchCgkData()
  }, [fetchCgkData])

  return cgkData
}
export default useMintCgk

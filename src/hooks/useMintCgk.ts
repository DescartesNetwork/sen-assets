import { useCallback, useEffect, useState } from 'react'
import { tokenProvider } from '@sentre/senhub'
import { util } from '@sentre/senhub'

const DEFAULT_DATA = {
  address: '',
  icon: '',
  name: 'TOKEN',
  price: 0,
  priceChange: 0,
  rank: 0,
  symbol: 'TOKEN',
  totalVolume: 0,
}

const useMintCgk = (mintAddress: string): CgkData => {
  const [cgkData, setCgkData] = useState<CgkData>(DEFAULT_DATA)

  const fetchCgkData = useCallback(async () => {
    try {
      const token = await tokenProvider.findByAddress(mintAddress)
      const ticket = token?.extensions?.coingeckoId
      const cgkData = await util.fetchCGK(ticket)
      return setCgkData(cgkData)
    } catch (error) {
      return setCgkData(DEFAULT_DATA)
    }
  }, [mintAddress])

  useEffect(() => {
    fetchCgkData()
  }, [fetchCgkData])

  return cgkData
}
export default useMintCgk

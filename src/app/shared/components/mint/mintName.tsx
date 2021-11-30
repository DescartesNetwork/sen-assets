import { useMemo } from 'react'

import useTokenProvider from 'app/shared/hooks/useTokenProvider'
import { shortenAddress } from 'shared/util'

const MintName = ({ mintAddress }: { mintAddress: string }) => {
  const tokens = useTokenProvider(mintAddress)

  const names = useMemo(() => {
    return tokens
      .map((token) => {
        if (!token) return 'Unknown'
        const { name, address } = token
        if (name) return name
        return shortenAddress(address)
      })
      .join('/')
  }, [tokens])
  return <span>{names}</span>
}

export default MintName

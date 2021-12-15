import { useMemo } from 'react'

import useTokenProvider from 'app/shared/hooks/useTokenProvider'
import { shortenAddress } from 'shared/util'

const MintName = ({
  mintAddress = '',
  separator = ' • ',
}: {
  mintAddress: string
  separator?: string
}) => {
  const tokens = useTokenProvider(mintAddress)

  const names = useMemo(() => {
    let names = tokens
      .map((token) => {
        if (!token) return shortenAddress(mintAddress, 2)
        const { name, address, symbol } = token
        if (tokens.length === 1 && name) return name
        if (symbol) return symbol
        return shortenAddress(address)
      })
      .join(separator)
    //Normal token
    if (tokens.length === 1) return names
    //LPT token
    return `${names} LP`
  }, [mintAddress, separator, tokens])
  return <span style={{ whiteSpace: 'nowrap' }}>{names}</span>
}

export default MintName

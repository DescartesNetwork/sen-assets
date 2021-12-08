import { useMemo } from 'react'

import useTokenProvider from 'app/shared/hooks/useTokenProvider'

const MintSymbol = ({
  mintAddress,
  separator = ' • ',
}: {
  mintAddress: string
  separator?: string
}) => {
  const tokens = useTokenProvider(mintAddress)
  const symbols = useMemo(() => {
    return tokens
      .map((token) => {
        if (!token) return 'UNKN'
        return token.symbol
      })
      .join(separator)
  }, [separator, tokens])
  return <span>{symbols}</span>
}

export default MintSymbol

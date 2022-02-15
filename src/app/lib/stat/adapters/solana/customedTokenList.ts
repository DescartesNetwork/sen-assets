import { TokenListProvider } from '@solana/spl-token-registry'
import supplementary from 'os/providers/tokenProvider/supplementary'

export const getTokenList = async () => {
  const tokenPr = new TokenListProvider()
  const tokenRaw = await tokenPr.resolve()
  return tokenRaw
    .filterByClusterSlug('mainnet-beta')
    .getList()
    .concat(supplementary)
}

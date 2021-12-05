import { utils } from '@senswap/sen-js'
import { TokenInfo } from '@solana/spl-token-registry'

export type MintInfo = {
  icon: any
  symbol: any
  name: any
  address: any
  rank: any
  price: any
  priceChange: any
  totalVolume: any
}

export class Oracle {
  static toUSD(amount: bigint, tokenInfo: TokenInfo, mintInfo: MintInfo) {
    const price = mintInfo?.price || 0
    const decimals = tokenInfo.decimals
    const balance = utils.undecimalize(amount, decimals)
    return price * Number(balance)
  }
}

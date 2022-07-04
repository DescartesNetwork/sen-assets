export type PriceColor = {
  up?: string
  down?: string
  default?: string
}

const DEFAULT_PRICE_COLOR: PriceColor = {
  up: '#14E041',
  down: '#D72311',
  default: '#FFC580',
}

export const parseColor = (
  priceChange: number | undefined = 0,
  config?: PriceColor,
) => {
  const priceColor = Object.assign({ ...DEFAULT_PRICE_COLOR }, config)
  if (priceChange < 0) return priceColor.down
  if (priceChange > 0) return priceColor.up
  return priceColor.default
}

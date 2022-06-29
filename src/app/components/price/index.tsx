import { numeric } from 'shared/util'
import useMintCgk from 'app/hooks/useMintCgk'
import { parseColor, PriceColor } from './parseColor'

const Price = ({
  mintAddress,
  colorized = false,
  configs,
}: {
  mintAddress: string
  colorized?: boolean
  configs?: PriceColor
}) => {
  const cgkData = useMintCgk(mintAddress)
  const color = parseColor(cgkData?.priceChange, configs)
  return (
    <span style={{ color: colorized ? color : 'inherit' }}>
      {!cgkData?.price
        ? '--'
        : `$${numeric(cgkData?.price).format('0,0.[0000000000]')}`}
    </span>
  )
}

export default Price
export { default as PriceChange } from './priceChange'
export { default as PriceIndicator } from './priceIndicator'
export { default as PriceSolidus } from './priceSolidus'

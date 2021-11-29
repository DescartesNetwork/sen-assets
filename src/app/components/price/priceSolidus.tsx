import { parseColor, PriceColor } from './parseColor'
import useMintCgk from 'app/shared/hooks/useMintCgk'

const PriceSolidus = ({
  mintAddress,
  colorized = false,
  configs,
  symbol,
}: {
  mintAddress: string
  colorized?: boolean
  configs?: PriceColor
  symbol: string
}) => {
  const cgkData = useMintCgk(mintAddress)
  const color = parseColor(cgkData?.priceChange, configs)

  return <span style={{ color: colorized ? color : 'inherit' }}>{symbol}</span>
}

export default PriceSolidus

import { numeric } from 'shared/util'
import { parseColor, PriceColor } from './parseColor'
import useMintCgk from 'app/hooks/useMintCgk'

const PriceChange = ({
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
      {numeric(Math.abs(cgkData?.priceChange)).format('0.[0]')}%
    </span>
  )
}

export default PriceChange

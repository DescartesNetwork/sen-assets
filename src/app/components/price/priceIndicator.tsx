import IonIcon from 'shared/antd/ionicon'

import { parseColor, PriceColor } from './parseColor'
import useMintCgk from 'app/shared/hooks/useMintCgk'

const PriceIndicator = ({
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

  let name = 'remove-outline'
  if (cgkData?.priceChange < 0) name = 'arrow-down-outline'
  if (cgkData?.priceChange > 0) name = 'arrow-up-outline'

  return (
    <span style={{ color: colorized ? color : 'inherit' }}>
      <IonIcon name={name} />
    </span>
  )
}

export default PriceIndicator

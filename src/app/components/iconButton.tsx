import { forwardRef } from 'react'
import IonIcon from 'shared/antd/ionicon'

export type IconButtonProps = {
  name: string
  color?: string
  onClick?: () => void
}

const IconButton = forwardRef<HTMLElement, IconButtonProps>(
  ({ name, color = '#BEC4EC', onClick = () => {}, ...rest }, ref) => {
    return (
      <span
        onClick={onClick}
        style={{ cursor: 'pointer', color }}
        {...rest}
        ref={ref}
      >
        <IonIcon name={name} />
      </span>
    )
  },
)

export default IconButton

import IonIcon from '@sentre/antd-ionicon'
import { Button } from 'antd'

import configs from 'configs'
import { useHistory } from 'react-router-dom'

const {
  manifest: { appId },
} = configs
const nftPath = '/app/' + appId + '/nfts-asset'

const Back = () => {
  const history = useHistory()
  return (
    <Button
      type="text"
      icon={<IonIcon name="arrow-back-outline" />}
      onClick={() => history.push(nftPath)}
    >
      Back
    </Button>
  )
}

export default Back

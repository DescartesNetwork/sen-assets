import { Avatar, Space, Typography } from "antd"
import SentreIcon from 'os/static/images/sen.svg'


const PowerBy = ({ spacing = 4, iconSize = 20 }: { spacing?: number, iconSize?: number }) => {

  return <Space size={spacing}>
    <Typography.Text style={{ fontSize: 12, color: '#7A7B85' }}>Power by</Typography.Text>
    <Avatar src={SentreIcon} size={iconSize} />
  </Space>
}

export default PowerBy
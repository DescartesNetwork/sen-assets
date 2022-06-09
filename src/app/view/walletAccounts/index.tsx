import { Card, Col, Row, Tabs, Typography } from 'antd'
import ListAccount from 'app/view/walletAccounts/tokens/listAccount'
import Settings from 'app/view/walletAccounts/tokens/settings'
import IonIcon from '@sentre/antd-ionicon'
import NFTs from './NFTs'

const SenAssets = () => {
  return (
    <Row gutter={[24, 24]} justify="center" align="middle">
      <Col xs={24} md={16} lg={16} xl={12} xxl={12}>
        <Card className="card-page card-sen-assets scrollbar">
          {/* Header */}
          <Row>
            <Col flex="auto">
              <Typography.Title level={4}>Sen Assets</Typography.Title>
            </Col>
            <Col>
              <Settings />
            </Col>
            {/* Body + Search */}
            <Col span={24}>
              <Tabs>
                <Tabs.TabPane
                  tab={
                    <span>
                      <IonIcon name="pricetag-outline" /> Tokens Assets
                    </span>
                  }
                  key="Tokens"
                >
                  <ListAccount />
                </Tabs.TabPane>
                <Tabs.TabPane
                  tab={
                    <span>
                      <IonIcon name="pricetag-outline" /> NFTs Assets
                    </span>
                  }
                  key="NFTs"
                >
                  <NFTs />
                </Tabs.TabPane>
              </Tabs>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  )
}
export default SenAssets

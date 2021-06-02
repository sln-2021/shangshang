import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Tabs, Table } from 'antd';
import Bills from './components/Bills';
import Goods from './components/Goods';
// import Shops from './components/Shops';
const { TabPane } = Tabs;

class Cart extends React.Component {
  render() {
    return (
      <PageHeaderWrapper content={<div> 此处可以配置商城话费,商城兑换内容.</div>}>
        <Card
          bordered={false}
          loading={false}
          style={{
            padding: '10px',
          }}
        >
          <Tabs tabPosition="left">
            <TabPane tab={<span>话费</span>} key="1">
              <Bills />
            </TabPane>
            <TabPane tab={<span>商品</span>} key="2">
              <Goods />
            </TabPane>
            {/* <TabPane tab={<span>商铺</span>} key="3">
              <Shops />
            </TabPane> */}
          </Tabs>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
export default Cart;

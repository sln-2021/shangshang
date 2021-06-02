import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Tabs } from 'antd';
import {serializeUrl} from '@/utils/serializeUrl'
import CreateMatchDDZ from './creatMatchTabs/createMatchDDZ';
import CreateMatchTDH from './creatMatchTabs/createMatchTDH';
import CreateMatchBZMJ from './creatMatchTabs/createMatchBZMJ';
import CreateCommonDDZ from './creatMatchTabs/createCommonDDZ';
import CreateCommonTDH from './creatMatchTabs/createCommonTDH';
import CreateCommonBZMJ from './creatMatchTabs/createCommonBZMJ';
import CreateLandlordsGMSMatch from './creatMatchTabs/createLandlordsGMSMatch';
import CreateTuiDaoHuGMSMatch from './creatMatchTabs/createTuiDaoHuGMSMatch';
import CreateBZMJGMSMatch from './creatMatchTabs/createBZMJGMSMatch';
import CreateRewardGameMatch from'./creatMatchTabs/createRewardGameMatch';
import CreateRewardGameTDHMatch from './creatMatchTabs/createRewardGameTDHMatch';
import CreateRewardGameBZMJMatch from './creatMatchTabs/createRewardGameBZMJMatch';
const { TabPane } = Tabs;

const CreateNewGame: React.FC = () => {
  let res = {}
  let activity1 = '1'
  let activity2 = '1'
  if(location.search.indexOf('?')>-1){
    const { id, type, tabs} = serializeUrl(location.href).param
    res={ id, type, tabs} 
    switch (type) {
      case 'ddz': activity1 = '1'; break;
      case 'tdh': activity1 = '2'; break;
      case 'bz': activity1 = '3'; break;
      default: activity1 = '1'; break;
    }
    activity2=tabs || 2;
  }
  
  return (
    <PageHeaderWrapper title="创建赛事" content={<div>主办方管理员可以直接创建赛事</div>}>
      <Card loading={false} style={{ padding: 14 }}>
        <Tabs defaultActiveKey={activity1}
          tabPosition="left">
          <TabPane tab={<span>斗地主</span>} key="1">
            <Card bordered={false} loading={false}>
              <Tabs defaultActiveKey={activity2}
              >
                <TabPane tab={<span>普通场</span>} key="1">
                  <CreateCommonDDZ />
                </TabPane>
                <TabPane tab={<span>比赛场</span>} key="2">
                  <CreateMatchDDZ data={res} />
                </TabPane>
                <TabPane tab={<span>冠名赛</span>} key="3">
                  <CreateLandlordsGMSMatch data={res} />
                </TabPane>
                <TabPane tab={<span>大奖赛</span>} key="4">
                  <CreateRewardGameMatch data={res} />
                </TabPane>
              </Tabs>
            </Card>
          </TabPane>
          <TabPane tab={<span>推倒胡</span>} key="2">
            <Card bordered={false} loading={false}>
              <Tabs defaultActiveKey={activity2}>
                <TabPane tab={<span>普通场</span>} key="1">
                  <CreateCommonTDH />
                </TabPane>
                <TabPane tab={<span>比赛场</span>} key="2">
                  <CreateMatchTDH data={res} />
                </TabPane>
                <TabPane tab={<span>冠名赛</span>} key="3">
                  <CreateTuiDaoHuGMSMatch data={res} />
                </TabPane>
                <TabPane tab={<span>大奖赛</span>} key="4">
                  <CreateRewardGameTDHMatch data={res} />
                </TabPane>
              </Tabs>
            </Card>
          </TabPane>
          <TabPane tab={<span>霸州麻将</span>} key="3">
            <Card bordered={false} loading={false}>
              <Tabs defaultActiveKey={activity2}>
                <TabPane tab={<span>普通场</span>} key="1">
                  <CreateCommonBZMJ />
                </TabPane>
                <TabPane tab={<span>比赛场</span>} key="2">
                  <CreateMatchBZMJ data={res} />
                </TabPane>
                <TabPane tab={<span>冠名赛</span>} key="3">
                  <CreateBZMJGMSMatch data={res} />
                </TabPane>
                <TabPane tab={<span>大奖赛</span>} key="4">
                  <CreateRewardGameBZMJMatch data={res} />
                </TabPane>
              </Tabs>
            </Card>
          </TabPane>
        </Tabs>
      </Card>
    </PageHeaderWrapper>
  )
}

export default CreateNewGame;

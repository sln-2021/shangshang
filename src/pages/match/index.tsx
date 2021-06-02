/* eslint-disable no-restricted-globals */
import React, { PureComponent } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Tabs } from 'antd';
import {serializeUrl} from '@/utils/serializeUrl'
import MatchDDZ from './matchList/matchDDZ';
import MatchTDH from './matchList/matchTDH';
import MatchBZMJ from './matchList/matchBZMJ';
import CommonDDZ from './matchList/commonDDZ';
import CommonTDH from './matchList/commonTDH';
import CommonBZMJ from './matchList/commonBZMJ';
import LandlordsGMSMatch from './matchList/LandlordsGMSMatch'; // 斗地主冠名赛
import TuiDaoHuGMSMatch from './matchList/TuiDaoHuGMSMatch'; // 推倒胡冠名赛
import BZMJGMSMatch from './matchList/BZMJGMSMatch'; 
import RewardGameDDZ from './matchList/rewardgameDDZ';
import RewardGameTDH from './matchList/RewardGameTDH';
import RewardGameBZMJ from './matchList/RewardGameBZMJ';

const { TabPane } = Tabs;

export default class MatchManager extends PureComponent {
  state = {
    activity1 :'1',
    activity2 : '1',
  };

  componentDidMount() {
    this.init();
  }

  init() {
    let activity1 = '1'
    let activity2 = '1'
    if(location.search.indexOf('?')>-1){
      const {  type, tabs} = serializeUrl(location.href).param
      switch (type) {
        case 'ddz': activity1 = '1'; break;
        case 'tdh': activity1 = '2'; break;
        case 'bz':  activity1 = '3'; break;
        default: activity1 = '1'; break;
      }
      activity2=tabs || 2;
    }
    this.setState({ activity1,activity2});
  }

  render() {
    const { activity1,activity2 } = this.state;
    return (
      <PageHeaderWrapper content={<div> 此处可以查看赛事列表以及可以创建赛事.</div>}>
        <Card  bordered={false} loading={false}>
        <Tabs  defaultActiveKey={activity1} tabPosition="left">
          <TabPane tab={<span>斗地主</span>} key="1">
              <Tabs defaultActiveKey={activity2} >
                <TabPane tab={<span>普通场</span>} key="1">
                  <CommonDDZ />
                </TabPane>
                <TabPane tab={<span>比赛场</span>} key="2">
                  <MatchDDZ />
                </TabPane>
                <TabPane tab={<span>冠名赛</span>} key="3">
                  <LandlordsGMSMatch />
                </TabPane>
                <TabPane tab={<span>大奖赛</span>} key="4">
                  <RewardGameDDZ />
                </TabPane>
              </Tabs>
          </TabPane>
          <TabPane tab={<span>推倒胡</span>} key="2">
              <Tabs defaultActiveKey={activity2}>
                <TabPane tab={<span>普通场</span>} key="1">
                <CommonTDH />
                </TabPane>
                <TabPane tab={<span>比赛场</span>} key="2">
                <MatchTDH />
                </TabPane>
                <TabPane tab={<span>冠名赛</span>} key="3">
                <TuiDaoHuGMSMatch />
                </TabPane>
                <TabPane tab={<span>大奖赛</span>} key="4">
                  <RewardGameTDH />
                </TabPane>
              </Tabs>
          </TabPane>
          <TabPane tab={<span>霸州麻将</span>} key="3">
            <Tabs defaultActiveKey={activity2}>
                <TabPane tab={<span>普通场</span>} key="1">
                <CommonBZMJ />
                </TabPane>
                <TabPane tab={<span>比赛场</span>} key="2">
                <MatchBZMJ />
                </TabPane>
                <TabPane tab={<span>冠名赛</span>} key="3">
                <BZMJGMSMatch />
                </TabPane>
                <TabPane tab={<span>大奖赛</span>} key="4">
                  <RewardGameBZMJ />
                </TabPane>
              </Tabs>
          </TabPane>
        </Tabs>


          {/* <Tabs
            activeKey={tab}
            onTabClick={(e: number) => {
              this.setState({ tab: e });
            }}
            animated={false}
          >
            <TabPane tab="斗地主普通场" key="1">
              <CommonDDZ />
            </TabPane>
            <TabPane tab="斗地主比赛场" key="2">
              <MatchDDZ />
            </TabPane>
            <TabPane tab="推倒胡普通场" key="3">
              <CommonTDH />
            </TabPane>
            <TabPane tab="推倒胡比赛场" key="4">
              <MatchTDH />
            </TabPane>
            <TabPane tab="斗地主冠名赛" key="5">
              <LandlordsGMSMatch />
            </TabPane>
          </Tabs> */}
        </Card>
      </PageHeaderWrapper>
    );
  }
}

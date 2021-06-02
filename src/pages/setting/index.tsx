/* eslint-disable react/jsx-no-bind */
import React from 'react';
import _ from 'lodash';
import { connect } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Alert, message } from 'antd';
import { easyDispatch } from '@/utils/easyDispatch';
import { getErrorMessage } from '../../common/convertError';
import { GameStateType } from '../../models/games';
import NoticeInfoCard from './cards/NoticeInfoCard';
import MatchSettingsCard from './cards/MatchSettingsCard';
import SystemAdSettingsCard from './cards/SystemAdSettingsCard';
import LcszSettingsCard from './cards/LcszSettingsCard';
import DownloadSettingsCard from './cards/DownloadSettingsCard';

export interface P {
  loadingFetchNotice: boolean;
  loadingFetchMatchSettings: boolean;
  loadingFetchSystemAdSettings: boolean;
  notice: any;
  games: GameStateType;
}

export interface S {
  error: string;
}

// @ts-ignore
@connect(({ notice, games, setting, loading }) => ({
  notice,
  games,
  setting,
  loadingFetchNotice: loading.effects['notice/fetchNotice'],
  loadingFetchMatchSettings: loading.effects['notice/fetchMatchSettings'],
  loadingFetchSystemAdSettings: loading.effects['notice/fetchSystemAd'],
}))
export default class bonusDetail extends React.Component<P, S> {
  state = {
    error: '',
  };

  componentDidMount() {
    this.query();
  }

  // @ts-ignore
  onError(response) {
    this.setState({ error: getErrorMessage(response) });
  }

  // @ts-ignore
  clearError() {
    this.setState({ error: '' });
  }

  async query() {
    this.clearError();
    // 获取公告设置
    await easyDispatch(this, 'notice/fetchNotice', {
      id: 1,
      onError: this.onError.bind(this),
    });
    // 获取比赛设置
    await easyDispatch(this, 'games/fetchMatchSettings', {
      onError: this.onError.bind(this),
    });
    // 获取广告配置
    await easyDispatch(this, 'setting/fetchSystemAd', {
      onError: this.onError.bind(this),
    });
    // 获取奖品下拉列表
    easyDispatch(this, 'games/fetchReward', {
      onError: () => message.error('获取奖品下拉列表失败'),
    });
  }

  onChangeNotice(value: any) {
    this.clearError();
    easyDispatch(this, 'notice/changeNotice', {
      id: 1,
      ...value,
      onError: code => {
        this.onError(code);
      },
      onOk: () => {
        message.success('修改成功!');
        this.query();
      },
    });
  }

  onChangeMatchSettings(value) {
    this.clearError();
    easyDispatch(this, 'games/changeMatchSettings', {
      id: 1,
      ...value,
      onError: code => {
        this.onError(code);
      },
      onOk: () => {
        message.success('修改成功!');
        this.query();
      },
    });
  }

  onChangeSystemAd(values) {
    this.clearError();
    easyDispatch(this, 'setting/changeSystemAd', {
      id: 1,

      gold: parseInt(values.gold, 10),
      dayCount: parseInt(values.dayCount, 10),
      onError: code => {
        this.onError(code);
      },
      onOk: () => {
        message.success('修改成功!');
        this.query();
      },
    });
  }

  onChangeLcsz(values, type) {
    this.clearError();
    console.log(values);

    if (type === '下载') {
      const downloadRewardsJson: any = [];

      values.downloadFormKeys.map((it: any, i: number) => {
        downloadRewardsJson.push({
          type: +values.downloadRewardType.filter(it => it !== undefined)[i].split('*')[0],
          cardType: +values.downloadRewardType.filter(it => it !== undefined)[i].split('*')[1],
          name: values.downloadRewardType.filter(it => it !== undefined)[i].split('*')[2],

          itemName: values.downloadRewardItem.filter(it => it !== undefined)[i].split('*')[0],
          itemid: +values.downloadRewardItem.filter(it => it !== undefined)[i].split('*')[1],
          itemInfo: values.downloadRewardItem.filter(it => it !== undefined)[i].split('*')[2],

          num: +values.downloadRewardNumber.filter(it => it !== undefined)[i],
        });
      });

      const formData = {
        id: 2,
        tasktype: 7,
        title: values.title,
        content: values.content,
        rewardjson: JSON.stringify(downloadRewardsJson),
      };

      easyDispatch(this, 'setting/changeLcsz', {
        ...formData,
        onError: code => {
          this.onError(code);
        },
        onOk: () => {
          message.success('修改成功!');
          this.query();
        },
      });
    }
    if (type === '绑定') {
      const bindRewardsJson: any = [];

      values.bindFormKeys.map((it: any, i: number) => {
        bindRewardsJson.push({
          type: +values.bindRewardType.filter(it => it !== undefined)[i].split('*')[0],
          cardType: +values.bindRewardType.filter(it => it !== undefined)[i].split('*')[1],
          name: values.bindRewardType.filter(it => it !== undefined)[i].split('*')[2],

          itemName: values.bindRewardItem.filter(it => it !== undefined)[i].split('*')[0],
          itemid: +values.bindRewardItem.filter(it => it !== undefined)[i].split('*')[1],
          itemInfo: values.bindRewardItem.filter(it => it !== undefined)[i].split('*')[2],

          num: +values.bindRewardNumber.filter(it => it !== undefined)[i],
        });
      });

      const formData = {
        id: 1,
        tasktype: 6,
        title: values.title,
        content: values.content,
        rewardjson: JSON.stringify(bindRewardsJson),
      };

      easyDispatch(this, 'setting/changeLcsz', {
        ...formData,
        onError: code => {
          this.onError(code);
        },
        onOk: () => {
          message.success('修改成功!');
          this.query();
        },
      });
    }

    // // id	long	id
    // // tasktype	int	活动类型 6 表示绑手机 7 表示登录app
    // // title	string	标题
    // // rewardjson	string	和比赛表的类似.奖励json

    // /** 格式化 下载奖励数组对象 */
    // const bindRewardsJson: any = [];
    // const downloadRewardsJson: any = [];

    // values.bindFormKeys.map((it: any, i: number) => {
    //   bindRewardsJson.push({
    //     type: +values.bindRewardType.filter(it => it !== undefined)[i].split('*')[0],
    //     cardType: +values.bindRewardType.filter(it => it !== undefined)[i].split('*')[1],
    //     name: values.bindRewardType.filter(it => it !== undefined)[i].split('*')[2],

    //     itemName: values.bindRewardItem.filter(it => it !== undefined)[i].split('*')[0],
    //     itemid: +values.bindRewardItem.filter(it => it !== undefined)[i].split('*')[1],
    //     itemInfo: values.bindRewardItem.filter(it => it !== undefined)[i].split('*')[2],

    //     num: +values.bindRewardNumber.filter(it => it !== undefined)[i],
    //   });
    // });

    // values.downloadFormKeys.map((it: any, i: number) => {
    //   downloadRewardsJson.push({
    //     type: +values.downloadRewardType.filter(it => it !== undefined)[i].split('*')[0],
    //     cardType: +values.downloadRewardType.filter(it => it !== undefined)[i].split('*')[1],
    //     name: values.downloadRewardType.filter(it => it !== undefined)[i].split('*')[2],

    //     itemName: values.downloadRewardItem.filter(it => it !== undefined)[i].split('*')[0],
    //     itemid: +values.downloadRewardItem.filter(it => it !== undefined)[i].split('*')[1],
    //     itemInfo: values.downloadRewardItem.filter(it => it !== undefined)[i].split('*')[2],

    //     num: +values.downloadRewardNumber.filter(it => it !== undefined)[i],
    //   });
    // });

    // // const formData = [
    // //   {
    // //     id: 1,
    // //     tasktype: 6,
    // //     title: '绑定',
    // //     rewardjson: JSON.stringify(bindRewardsJson),
    // //   },
    // //   {
    // //     id: 2,
    // //     tasktype: 7,
    // //     title: '下载',
    // //     rewardjson: JSON.stringify(downloadRewardsJson),
    // //   },
    // // ];

    // const formData ={
    //     id: 1,
    //     tasktype: 6,
    //     title: '绑定',
    //     rewardjson: JSON.stringify(bindRewardsJson),
    //   }

    // easyDispatch(this, 'setting/changeLcsz', {
    //   ...formData,
    //   onError: code => {
    //     this.onError(code);
    //   },
    //   onOk: () => {
    //     message.success('修改成功!');
    //     this.query();
    //   },
    // });
  }

  render() {
    const { error } = this.state;
    const {
      loadingFetchNotice,
      loadingFetchMatchSettings,
      loadingFetchSystemAdSettings,
      notice,
      games,
      setting,
    } = this.props;

    return (
      <PageHeaderWrapper>
        {error ? (
          <Alert message={error} type="error" showIcon style={{ marginBottom: 10 }} />
        ) : null}

        <NoticeInfoCard
          loading={loadingFetchNotice}
          details={notice.notice}
          onChangeNotice={this.onChangeNotice.bind(this)}
        />

        <MatchSettingsCard
          loading={loadingFetchMatchSettings}
          details={games.matchSettings}
          onChangeMatchSettings={this.onChangeMatchSettings.bind(this)}
        />

        <SystemAdSettingsCard
          loading={loadingFetchSystemAdSettings}
          details={setting.SystemAd}
          onChange={this.onChangeSystemAd.bind(this)}
        />

        <DownloadSettingsCard reward={games.reward} onChange={this.onChangeLcsz.bind(this)} />

        <LcszSettingsCard reward={games.reward} onChange={this.onChangeLcsz.bind(this)} />
      </PageHeaderWrapper>
    );
  }
}

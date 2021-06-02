/* eslint-disable no-unused-expressions */
/* eslint-disable react/jsx-no-bind */
import React, { Fragment } from 'react';
import _ from 'lodash';
import { connect } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Alert, Icon, message, Popconfirm, Tag, Row, Col, Avatar, Table } from 'antd';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { RewardStateType } from '../../models/reward';
// eslint-disable-next-line import/order
import { easyDispatch } from '@/utils/easyDispatch';
import { getErrorMessage } from '../../common/convertError';
import { color } from '../../common/color';
import { getRewardType } from '../../common/convert'
import NewReward from './modals/NewReward';
import NewRewardType from './modals/NewRewardType';
import ChangeReward from './modals/ChangeReward';

const actionRef = React.createRef<ActionType>();

export interface P {
  loading: boolean;
  rewards: RewardStateType;
  rewardItems: RewardStateType;
}

export interface S {
  error: string;
  modalError: string;
}

class Reward extends React.Component<P, S> {
  state = {
    error: '',
    modalError: '',
  };

  componentDidMount() {
    this.init();
  }

  onAddRewardType(v: { name: string }, callback: Function) {
    this.clearError();
    // @ts-ignore
    easyDispatch(this, 'reward/addReward', {
      ..._.pick(v, 'name', 'cardType'),

      onError: (code: any) => {
        callback(false); // don't close
        this.onModalError(code);
      },
      onOk: () => {
        callback(true);
        message.success('添加成功!');
        this.init();
      },
    });
  }

  onAddReward(
    id: number,
    v: {
      file?: any;
      itemid?: number;
      itemName: string;
      name: string;
    },
    callback: Function,
  ) {
    this.clearError();
    // @ts-ignore
    easyDispatch(this, 'reward/addRewardItems', {
      ..._.pick(v, 'name', 'itemName', 'itemInfo', 'isSelf'),
      type: id,
      // 二进制文件数据
      file: v!.file && v.file.fileList[0] ? v.file.fileList[0].originFileObj : null,
      itemid: v.itemid || '',
      onError: (code: any) => {
        callback(false); // don't close
        this.onModalError(code);
      },
      onOk: () => {
        callback(true);
        message.success('添加成功!');
        this.init();
      },
    });
  }

  // 修改奖励
  onChangeRewardItem(
    id: number,
    v: {
      file?: any;
      itemid?: number;
      itemName: string;
      name: string;
    },
    callback: Function,
  ) {
    this.clearError();
    // @ts-ignore
    easyDispatch(this, 'reward/changeRewardItem', {
      ..._.pick(v, 'name', 'itemName', 'itemInfo', 'isSelf'),
      id,
      // 二进制文件数据
      file: v!.file && v.file.fileList[0] ? v.file.fileList[0].originFileObj : null,
      itemid: v.itemid || '',
      onError: (code: any) => {
        callback(false); // don't close
        this.onModalError(code);
      },
      onOk: () => {
        callback(true);
        message.success('修改成功!');
        this.init();
      },
    });
  }




  // @ts-ignore
  onError(response: any) {
    this.setState({ error: getErrorMessage(response) });
  }

  onModalError(response: any) {
    this.setState({ modalError: getErrorMessage(response) });
  }

  init() {
    easyDispatch(this, 'reward/fetchRewards', {
      onError: this.onError.bind(this),
    });
  }

  clearError() {
    this.setState({ error: '', modalError: '' });
  }

  render() {
    const { error, modalError } = this.state;
    const { rewards } = this.props;

    const columns: ProColumns[] = [
      {
        title: 'ID',
        dataIndex: 'id',
        hideInSearch: true,
      },
      {
        title: '奖励类型',
        dataIndex: 'name',
        key: 'name',
        valueType: 'text',
        width: 100,
        hideInSearch: true,
        render: (_, row) => (row.name ? row.name : '--'),
      },
      {
        title: '奖励来源',
        dataIndex: 'cardType',
        width: 100,
        render: (_, row) => <span style={{ color: getRewardType(row.cardType).color }} >{getRewardType(row.cardType).name}</span>,
        hideInSearch: true,
      },
      {
        title: '奖励物品',
        dataIndex: 'id',
        key: 'id',
        hideInSearch: true,
        render: (_, row) =>
          row.lcMatchRewards
            ? row.lcMatchRewards.map(it =>
              <ChangeReward
                error={modalError}
                onShowAsync={() => this.clearError()}
                onOk={this.onChangeRewardItem.bind(this, it.id)}
                data={it}
              >
                <div style={{ cursor: 'pointer', color: color.link, marginBottom: 10, display: 'inline-block' }}>
                  <Tag key={it.itemid}>{it.itemName}</Tag>
                </div>
              </ChangeReward>
            ) : null,
      },
      {
        title: '操作',
        valueType: 'option',
        align: 'right',
        width: 300,
        render: (text, row, _, action) => (
          <Fragment>
            <span>
              <NewReward
                error={modalError}
                onShowAsync={() => this.clearError()}
                onOk={this.onAddReward.bind(this, row.id)}
                data={row}
              >
                <span style={{ cursor: 'pointer', color: color.link }}>
                  <Icon type="plus" style={{ marginRight: 4 }} />
                  <span>添加奖励物品</span>
                </span>
              </NewReward>
            </span>
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderWrapper
        content={<div>此处可以管理游戏奖励数据.</div>}
        extraContent={
          <NewRewardType
            onShowAsync={() => this.clearError()}
            onOk={this.onAddRewardType.bind(this)}
            error={modalError}
          />
        }
      >
        {error && (
          <Alert
            message="获取玩家列表失败"
            type="error"
            showIcon
            style={{ marginBottom: 10 }}
            description={
              <span>
                错误信息: {error} <br />
                <a
                  onClick={() => {
                    this.init();
                    this.clearError();
                  }}
                >
                  <b>刷新页面</b>
                </a>
              </span>
            }
          />
        )}
        <Card bordered={false} loading={false}>
          <ProTable
            options={{ fullScreen: false, reload: false, setting: false }}
            columns={columns}
            dataSource={rewards}
            expandedRowRender={expandedRowRender}
            search={false}
            // @ts-ignore
            actionRef={actionRef}
            rowKey="id"
            pagination={{ showSizeChanger: true }}
            dateFormatter="string"
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

function expandedRowRender(data, index, indent, expanded) {
  const columns = [
    { title: 'ID', dataIndex: 'id' },
    { title: '图标', dataIndex: 'icon', render: (text, record, index) => <Avatar src={record.icon} /> },
    { title: '道具编号', dataIndex: 'itemid' },
    { title: '道具名称', dataIndex: 'itemName' },
    { title: '可兑换商品信息', dataIndex: 'itemInfo' },
    { title: '可兑换商品类型', dataIndex: 'type', render: (text, record, index) => <span> {record.type === 1 ? '人物' : record.type === 2 ? '道具' : '实物'}</span> },
    { title: '是否自提', dataIndex: 'isSelf', render: (text, record, index) => <span> {record.isSelf === 1 ? '是' : '否'}</span> }
    // {
    //   title: '更新',
    //   dataIndex: 'option',
    //   align: 'right',
    //   render: (text, row, _, action) => (
    //     <Fragment>
    //       <span>
    //         <ChangeReward
    //           error={modalError}
    //           onShowAsync={() => this.clearError()}
    //           onOk={this.onChangeRewardItem.bind(this, row.id)}
    //           data={row}
    //         >
    //           <span style={{ cursor: 'pointer', color: color.link }}>
    //             <Icon type="plus" style={{ marginRight: 4 }} />
    //             <span>添加奖励物品</span>
    //           </span>
    //         </ChangeReward>
    //         2313
    //       </span>
    //     </Fragment>
    //   )
    // },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div style={{ width: '100%', display: 'flex' }}>
        <Table columns={columns} title={() => '奖品详情'} style={{ width: '100%' }} dataSource={data.lcMatchRewards} size="small" />
      </div>
    </div>
  );
}

// @ts-ignore
export default connect(
  ({
    reward: { rewards, rewardItems },
    loading,
  }: {
    reward: RewardStateType;
    loading: {
      effects: {
        [key: string]: boolean;
      };
    };
  }) => ({
    rewards,
    rewardItems,
    loading: loading.effects['reward/fetchRewards'],
  }),
)(Reward);

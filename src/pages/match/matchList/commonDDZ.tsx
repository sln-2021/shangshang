/* eslint-disable react/jsx-no-bind */
import React, { PureComponent, Fragment } from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import { Card, Button, message } from 'antd';
import ProTable from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { GameStateType } from '../../../models/games';
import { color } from '../../../common/color';
// eslint-disable-next-line import/order
import { easyDispatch } from '@/utils/easyDispatch';
import { getErrorMessage } from '../../../common/convertError';
import DescriptionList from '../../../components/DescriptionList';
import ChangeCommonDDZModal from '../modals/ChangeCommonDDZModal';
import { ToolOutlined } from '@ant-design/icons';
import { fetchLandlordsCommon } from '../../../services/games';
const { Description } = DescriptionList;
// // 获取 React 元素
type GithubIssueItem = {
  name: string;
  id: number;
  costName: string;
  games: string;
  baseScore: string;
  joinMin: string;
  matchType: string;
  state: string;
};

const actionRef = React.createRef<ActionType>();
type P = {
  games: any;
  reward: any;
};

class CommonDDZ extends PureComponent<P> {
  state = {
    error: '',
    modalError: '',
  };

  componentDidMount() {
    this.init();
  }

  onError(response: any) {
    this.setState({ error: response.msg });
  }

  onModalError(response: any) {
    this.setState({ modalError: getErrorMessage(response) });
  }

  onChangeLandlordsCommon(id, v, callback) {
    this.clearError();

    /** 格式化 奖励数组对象 */
    const rewards: any = [
      {
        type: v['rewardType-1'],
        itemid: v['rewardItem-1'],
        num: v['rewardNumber-1'],
      },
      {
        type: v['rewardType-2'],
        itemid: v['rewardItem-2'],
        num: v['rewardNumber-2'],
      },
      {
        type: v['rewardType-3'],
        itemid: v['rewardItem-3'],
        num: v['rewardNumber-3'],
      },
    ];

    easyDispatch(this, 'games/changeLandlordsCommon', {
      id,
      // 普通字符串数据
      ..._.pick(v, 'name', 'games', 'matchType', 'intro', 'baseScore'),
      joinMin: v.join_min,
      joinMax: v.join_max,

      costType: v.applicationFeeType,
      costId: v.applicationFeeItem,
      costN: v.applicationFeeNumber,

      rewards: JSON.stringify(rewards).toString(),
      onError: (code) => {
        callback(false); // don't close
        this.onModalError(code);
      },
      onOk: () => {
        callback(true);
        message.success('修改成功!');
        actionRef!.current!.reload();
      },
    });
  }

  init() {
    easyDispatch(this, 'games/fetchReward', {
      onError: () => message.error('获取奖品下拉列表失败'),
    });
    easyDispatch(this, 'organizer/fetchOrganizerTree', {
      onError: () => message.error('获取下拉列表失败'),
    });
  }

  clearError() {
    this.setState({ error: '', modalError: '' });
  }

  render() {
    const { error, modalError } = this.state;
    const { reward } = this.props;
    const columns: ProColumns<GithubIssueItem>[] = [
      {
        title: 'ID',
        dataIndex: 'id',
        valueType: 'text',
      },
      {
        title: '赛事名称',
        dataIndex: 'name',
        key: 'name',
        copyable: true,
        ellipsis: true,
        valueType: 'text',
      },
      {
        title: '报名费',
        dataIndex: 'costName',
        key: 'costName',
        copyable: true,
        ellipsis: true,
        valueType: 'text',
        hideInSearch: true,
        render: (_, row) =>
          row.costName ? `${row.costName} x${row.costN}` : '--',
      },
      {
        title: '对局数',
        dataIndex: 'games',
        key: 'games',
        ellipsis: true,
        valueType: 'text',
        hideInSearch: true,
      },
      {
        title: '底分',
        dataIndex: 'baseScore',
        key: 'baseScore',
        ellipsis: true,
        valueType: 'text',
        hideInSearch: true,
      },
      {
        title: '对局限制（金币）',
        dataIndex: 'joinMin',
        key: 'joinMin',
        ellipsis: true,
        valueType: 'text',
        hideInSearch: true,
        render: (_, row) =>
          row.joinMin ? `${row.joinMin} ～ ${row.joinMax}` : '--',
      },
      {
        title: '类型',
        dataIndex: 'matchType',
        ellipsis: true,
        initialValue: '',
        key: 'matchType',
        valueEnum: {
          all: { text: '全部', status: 'Default' },
          1: { text: '初级赛', status: 'Warning' },
          2: { text: '中级赛', status: 'Success' },
          3: { text: '高级赛', status: 'Success' },
          4: { text: '大师赛', status: 'Success' },
        },
      },
      {
        title: '状态',
        dataIndex: 'state',
        ellipsis: true,
        initialValue: 'all',
        key: 'state',
        hideInSearch: true,
        valueEnum: {
          all: { text: '全部', status: 'Default' },
          0: { text: '初始化', status: 'Warning' },
          1: { text: '已发布', status: 'Success' },
        },
      },
      {
        title: '操作',
        valueType: 'option',
        fixed: 'right',
        render: (text, row, _, action) => (
          <Fragment>
            <span>
              <ChangeCommonDDZModal
                error={modalError}
                info={row}
                reward={reward}
                onShowAsync={() => this.clearError()}
                onOk={this.onChangeLandlordsCommon.bind(this, row.id)}
              >
                <span style={{ cursor: 'pointer', color: color.link }}>
                  {/* <Icon type="tool" style={{ marginRight: 4 }} /> */}
                  <ToolOutlined />
                  <span>修改</span>
                </span>
              </ChangeCommonDDZModal>
            </span>
          </Fragment>
        ),
      },
    ];

    return (
      <Fragment>
        <Card bordered={false}>
          <ProTable
            columns={columns}
            actionRef={actionRef}
            expandedRowRender={expandedRowRender}
            request={async (params = {}) => {
              const { current, pageSize, name, matchType } = params || {};

              const param = {
                pageNum: current,
                pageSize,
                name,
                matchType,
                gamename: 'ddztrain',
              };
              const res = await fetchLandlordsCommon(param);
              return {
                data: res.data.list,
                page: params.current,
                success: true,
                total: res.data.total as number,
              };
            }}
            rowKey="id"
            pagination={{ showSizeChanger: true }}
            dateFormatter="string"
          />
        </Card>
      </Fragment>
    );
  }
}

function expandedRowRender(data: any) {
  const rewards = JSON.parse(data.rewards);
  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <DescriptionList
        size="large"
        title={<span>相关的比赛信息 :</span>}
        style={{ marginBottom: 32, flex: 1 }}
        layout="horizontal"
        col={1}
      >
        <Description term="赛事简介">{data.intro}</Description>
      </DescriptionList>

      <DescriptionList
        size="large"
        title={<span>奖励信息 :</span>}
        style={{ marginBottom: 32, flex: 2 }}
        layout="horizontal"
        col={1}
      >
        <Description term="单个最高分奖励">
          {rewards[0].name} x{rewards[0].num}
        </Description>
        <Description term="两个最高分奖励">
          {rewards[1].name} x{rewards[1].num}
        </Description>
        <Description term="三个最高分奖励">
          {rewards[2].name} x{rewards[2].num}
        </Description>
      </DescriptionList>
    </div>
  );
}

export default connect(
  ({
    games,
    loading,
  }: {
    games: GameStateType;
    reward: any;
    loading: {
      effects: {
        [key: string]: boolean;
      };
    };
  }) => ({
    games,
    reward: games.reward,
    loadingFetch: loading.effects['games/fetchLandlordsCommon'],
  }),
)(CommonDDZ);

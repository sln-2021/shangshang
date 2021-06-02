/* eslint-disable react/sort-comp */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'umi';
import moment from 'moment';
import { history as router } from 'umi';
import { Card, Alert, Icon, message, Popconfirm, DatePicker, Tag } from 'antd';
import ProTable, { ProColumns, TableDropdown, ActionType } from '@ant-design/pro-table';
import { easyDispatch } from '@/utils/easyDispatch';
import { getErrorMessage } from '../../../common/convertError';
import AvatarIcon from '../../../components/AvatarIcon';
import { color } from '../../../common/color';
import DescriptionList from '../../../components/DescriptionList';
import ChangeMatchDDZStatesModal from '../modals/ChangeMatchDDZStatesModal';

const { RangePicker } = DatePicker;
const { Description } = DescriptionList;
// 获取 React 元素
const actionRef = React.createRef<ActionType>();

@connect(({ games, user, loading }) => ({
  games,
  user,
  loadingFetch: loading.effects['games/fetchLandlordsMatch'],
}))
export default class BZMJGMSMatch extends PureComponent {
  state = {
    error: '',
    modalError: '',
  };

  onError(response: any) {
    this.setState({ error: response.msg });
  }

  onModalError(response: any) {
    this.setState({ modalError: getErrorMessage(response) });
  }

  clearError() {
    this.setState({ error: '', modalError: '' });
  }

  queryUserInfo() {
    easyDispatch(this, 'user/fetchUserInfo', {
      onOk: () => console.log('*刷新个人信息成功*'),
      onError: () => console.log('刷新用信息失败'),
    });
  }

  // 删除
  onDeleteMatch(matchScheduleId: number) {
    this.clearError();
    easyDispatch(this, 'games/deleteLandlordsGMSMatch', {
      matchScheduleId,
      onError: (code: Request) => {
        this.onError(code);
      },
      onOk: () => {
        message.success('删除成功!');
        actionRef!.current!.reload();
      },
    });
  }
  onPauseMatch(matchId: number) {
    this.clearError();
    easyDispatch(this, 'games/pauseGMSMatch', {
      matchId,
      onError: (code: Request) => {
        this.onError(code);
      },
      onOk: () => {
        message.success('暂停比赛成功!');
        actionRef!.current!.reload();
      },
    });
  }
  // 审核
  onChangeMatchStates(id, v, callback) {
    this.clearError();
    easyDispatch(this, 'games/changeLandlordsGMSMatchState', {
      ...v,
      id,
      onError: code => {
        callback(false); //don't close
        this.onModalError(code);
      },
      onOk: () => {
        callback(true);
        message.success('审核成功!');
        actionRef!.current!.reload();
      },
    });
  }

  onSkip(value: any) {
    router.push(`/match/updateMatch?id=${value.id}`);
  }

  onPermissions(status) {
    if (Number(status) >= 1) return false;
    return true;
  }

  render() {
    const { error, modalError } = this.state;
    const { userInfo } = this.props.user;
    const { landlordsGMSMatch } = this.props!.games;
    // const {
    //   matchRewardVO = { goldSum: '--', matchticketSum: '--', roomcardSum: '--' },
    // } = landlordsGMSMatch;

    const columns: any = [
      {
        title: 'ID',
        dataIndex: 'id',
        valueType: 'text',
      },
      {
        title: 'logo',
        key: 'matchLogo',
        dataIndex: 'matchLogo',
        hideInSearch: true,
        render: (_, row) => <AvatarIcon iconURL={row.matchLogo} name={row.name} />,
      },
      {
        title: '赛事名称',
        dataIndex: 'name',
        key: 'name',
        copyable: true,
        ellipsis: true,
        width: 110,
        valueType: 'text',
      },
      // {
      //   title: '报名费',
      //   key: 'registrationFee',
      //   dataIndex: 'registrationFee',
      //   ellipsis: true,
      //   valueType: 'money',
      //   hideInSearch: true,
      // },
      // {
      //   title: '奖励金',
      //   dataIndex: 'bonus',
      //   key: 'bonus',
      //   ellipsis: true,
      //   valueType: 'money',
      //   hideInSearch: true,
      // },
      {
        title: '比赛展示日期',
        key: 'displayStartTime',
        dataIndex: 'displayStartTime',
        valueType: 'text',
        hideInSearch: true,
        render: (_, row) => {
          const { displayStartTime, displayStopTime } = row;
          return (
          (displayStartTime && displayStopTime) ?
            <>
              <Tag color="blue">
                {moment(displayStartTime).format('YYYY/MM/DD')}-
                {moment(displayStopTime).format('YYYY/MM/DD')}
              </Tag>
            </>: '--'
          );
        },
      },

      {
        title: '每日比赛展示开始 结束时间',
        dataIndex: 'displayTimeStr',
        key: 'displayTimeStr',
        ellipsis: true,
        valueType: 'text',
        hideInSearch: true,
        width: 90,
        render: (_, row) => {
          const { displayTimeStr, displayEndTimeStr } = row;
          return (
          (displayTimeStr && displayEndTimeStr) ?
            <>
              <Tag color="#5BD8A6">
                {displayTimeStr}-{displayEndTimeStr}
              </Tag>
            </>: '--'
          );
        },
      },
      {
        title: '总场次',
        dataIndex: 'totalMatches',
        key: 'totalMatches',
        ellipsis: true,
        valueType: 'digit',
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
      // {
      //   title: '发奖时间',
      //   key: 'rewardTime',
      //   dataIndex: 'rewardTime',
      //   valueType: 'dateTime',
      //   hideInSearch: true,
      // },
      {
        title: '已进行比赛的场次',
        dataIndex: 'finishN',
        key: 'finishN',
        ellipsis: true,
        valueType: 'text',
        hideInSearch: true,
      },
      {
        title: '真人获得第一名的次数',
        dataIndex: 'realmanWinN',
        key: 'realmanWinN',
        ellipsis: true,
        valueType: 'text',
        hideInSearch: true,
      },
      {
        title: '按时开赛间隔',
        key: 'repeatInterval',
        dataIndex: 'repeatInterval',
        valueType: 'text',
        hideInSearch: true,
        render: (_, row) => (row.repeatInterval ? `${row.repeatInterval}秒` : '--'),
      },
      {
        title: '比赛人数',
        dataIndex: 'numberCompetitors',
        key: 'numberCompetitors',
        ellipsis: true,
        valueType: 'text',
        hideInSearch: true,
      },
      {
        title: '机器人作弊场次',
        dataIndex: 'cheatGameN',
        key: 'cheatGameN',
        copyable: true,
        ellipsis: true,
        valueType: 'text',
      },
      {
        title: '单场轮次',
        dataIndex: 'rotation',
        key: 'rotation',
        ellipsis: true,
        valueType: 'text',
        hideInSearch: true,
      },
      {
        title: '比赛日期',
        key: 'startTime',
        dataIndex: 'startTime',
        valueType: 'text',
        hideInSearch: true,
        render: (_, row) => {
          const { startTime, stopTime } = row;
          return (
            <>
              <Tag color="blue">
                {moment(startTime).format('YYYY/MM/DD')}-{moment(stopTime).format('YYYY/MM/DD')}
              </Tag>
            </>
          );
        },
      },
      {
        title: '每日比赛时间',
        key: 'dayBeginTimeStr',
        dataIndex: 'dayBeginTimeStr',
        valueType: 'text',
        hideInSearch: true,
        render: (_, row) => {
          const { dayBeginTimeStr, dayEndTimeStr } = row;
          return (
            <>
              <Tag color="#5BD8A6">
                {dayBeginTimeStr}-{dayEndTimeStr}
              </Tag>
            </>
          );
        },
      },
      {
        title: '状态',
        dataIndex: 'status',
        ellipsis: true,
        initialValue: 'all',
        key: 'status',
        valueEnum: {
          all: { text: '全部', status: 'Default' },
          0: { text: '待审核', status: 'Warning' },
          1: { text: '审核通', status: 'Success' },
          2: { text: '已拒绝', status: 'Error' },
        },
      },
      {
        title: '比赛时间段',
        key: 'rangePicker',
        dataIndex: 'authTime',
        hideInTable: true,
        valueType: 'dateTime',
        renderFormItem: (item, props) => (
          <RangePicker defaultValue={null} onChange={e => props.onChange(e)} />
        ),
      },
      {
        title: '操作',
        valueType: 'option',
        dataIndex: 'id',
        render: (text, row, _, action) => (
          <Fragment>
            <span>
              {row.processStatus === 2 ? (
                <span style={{ cursor: 'pointer', color: color.grey[7] }}>
                  <Icon type="pause" style={{ marginRight: 4 }} />
                  <span>暂停比赛</span>
                </span>
              ) : this.onPermissions(row.status) ? (
                <ChangeMatchDDZStatesModal
                  error={modalError}
                  info={row}
                  userInfo={userInfo}
                  onShowAsync={() => this.clearError()}
                  onOk={this.onChangeMatchStates.bind(this, row.id)}
                >
                  <span style={{ cursor: 'pointer', color: color.link }}>
                    <Icon type="tool" style={{ marginRight: 4 }} />
                    <span>审核比赛</span>
                  </span>
                </ChangeMatchDDZStatesModal>
              ) : (
                <span style={{ cursor: 'pointer', color: color.grey[7] }}>
                  <Icon type="tool" style={{ marginRight: 4 }} />
                  <span>审核比赛</span>
                </span>
              )}
            </span>
            <TableDropdown
              style={{ marginLeft: 10 }}
              menus={[
                {
                  key: 'copy',
                  name: (
                    <span>
                      <Popconfirm
                        title={
                          <span>
                            确认复制 <b>{row.name}</b> 比赛吗?
                          </span>
                        }
                        onConfirm={() =>
                          router.push(`/match/newMatch?id=${row.id}&type=${'bz'}&tabs=3`)
                        }
                        okType="danger"
                        okText="确认"
                        cancelText="取消"
                      >
                        <span style={{ cursor: 'pointer', color: color.success }}>
                          <Icon type="copy" style={{ marginRight: 4 }} />
                          <span>复制</span>
                        </span>
                      </Popconfirm>
                    </span>
                  ),
                },
                {
                  key: 'delete',
                  name: (
                    <span>
                      <Popconfirm
                        title={
                          <span>
                            确认删除 <b>{row.name}</b> 吗?
                          </span>
                        }
                        onConfirm={this.onDeleteMatch.bind(this, row.id)}
                        okType="danger"
                        okText="确认"
                        cancelText="取消"
                      >
                        <span style={{ cursor: 'pointer', color: color.error }}>
                          <Icon type="delete" style={{ marginRight: 4 }} />
                          <span>删除</span>
                        </span>
                      </Popconfirm>
                    </span>
                  ),
                },
                {
                  key: 'info',
                  name: (
                    <span>
                      <span
                        style={{ cursor: 'pointer', color: color.link }}
                        onClick={() => router.push(`/match/tdh-gms-info?id=${row.id}`)}
                      >
                        <Icon type="eye" style={{ marginRight: 2 }} /> 比赛详细
                      </span>
                    </span>
                  ),
                },
                {
                  key: 'award',
                  name: (
                    <span>
                      <span
                        style={{ cursor: 'pointer', color: color.link }}
                        onClick={() => router.push(`/match/award?id=${row.id}`)}
                      >
                        <Icon type="coffee" style={{ marginRight: 2 }} /> 发奖记录
                      </span>
                    </span>
                  ),
                },
                {
                  key: 'pause',
                  name: (
                    <span>
                      <Popconfirm
                        title={
                          <span>
                            确认暂停 <b>{row.name}</b> 吗?
                          </span>
                        }
                        onConfirm={this.onPauseMatch.bind(this, row.id)}
                        okType="danger"
                        okText="确认"
                        cancelText="取消"
                      >
                        <span style={{ cursor: 'pointer', color: color.link }}>
                          <Icon type="pause" style={{ marginRight: 4 }} />
                          <span> 比赛暂停</span>
                        </span>
                      </Popconfirm>
                    </span>
                  ),
                },
              ].filter(it => {
                // 退款 删除 详情
                // 1通过 2拒绝 0 待审核
                if (row.status == 0) return it.key !== 'refund';
                if (row.status == 1) return it.key !== 'delete';
                if (row.status == 2) return it.key !== 'copy' && it.key !== 'award';
                return it;
              })}
            />
          </Fragment>
        ),
      },
    ];

    return (
      <Fragment>
        {error ? (
          <Alert
            message="获取赛事列表失败"
            type="error"
            showIcon
            style={{ marginBottom: 10 }}
            description={
              <span>
                错误信息: {error} <br />
                <a
                  onClick={() => {
                    actionRef.current.reset(), this.clearError();
                  }}
                >
                  <b>刷新页面</b>
                </a>
              </span>
            }
          />
        ) : (
          <div style={{ width: '100%', whiteSpace: 'nowrap', overflow: 'scroll' }}>
            <ProTable
              // headerTitle={
              //   <>
              //     <h1>总统计</h1>
              //     <Tag color="#f50">
              //       总金币统计:
              //       {matchRewardVO.goldSum || '--'}
              //     </Tag>
              //     <Tag color="#2db7f5">
              //       总钻石统计:
              //       {matchRewardVO.roomcardSum || '--'}
              //     </Tag>
              //     <Tag color="#87d068">
              //       总奖券统计:
              //       {matchRewardVO.matchticketSum || '--'}
              //     </Tag>
              //   </>
              // }
              columns={columns}
              actionRef={actionRef}
              expandedRowRender={expandedRowRender}
              request={async (params = {}) => {
                const { current, pageSize, status, rangePicker, name, type } = params || {};
                const [beginTime, endTime] = rangePicker
                  ? [moment(rangePicker[0]).format('x'), moment(rangePicker[1]).format('x')]
                  : [null, null];
                // 1.执行 effects 方法获取数据
                await easyDispatch(this, 'games/fetchLandlordsGMSMatch', {
                  pageNum: current,
                  pageSize,
                  status,
                  beginTime,
                  endTime,
                  findStr: name,
                  type,
                  gameName: 'bz',
                  onError: this.onError.bind(this),
                });
                // 2.获取列表数据
                const { landlordsGMSMatch } = await this.props.games;
                return {
                  data: landlordsGMSMatch!.pageInfo.list,
                  page: params.current,
                  success: true,
                  total: landlordsGMSMatch.pageInfo.total as number,
                };
              }}
              rowKey="id"
              pagination={{ showSizeChanger: true }}
              dateFormatter="string"
            />
          </div>
        )}
      </Fragment>
    );
  }
}

function expandedRowRender(data, index, indent, expanded) {
  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <DescriptionList
        size="large"
        title={<span>相关的比赛信息 :</span>}
        style={{ marginBottom: 32, flex: 2 }}
        layout="horizontal"
        col={1}
      >
        <Description term="单条统计">
          <Tag color="magenta">
            金币统计:
            {data.gold || '--'}
          </Tag>
          <Tag color="gold">
            钻石统计:
            {data.roomcard || '--'}
          </Tag>
          <Tag color="purple">
            奖券统计:
            {data.matchticket || '--'}
          </Tag>
        </Description>
        <Description term="赛事章程">{data.competitionCharter}</Description>
        <Description term="比赛须知">{data.competitionInstructions}</Description>
      </DescriptionList>
    </div>
  );
}

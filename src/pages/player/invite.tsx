import React, { Fragment } from 'react';
import _ from 'lodash';
import moment from 'moment';
import { connect } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Alert, Icon, message, Popconfirm } from 'antd';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { PlayerStateType } from '../../models/player';
import DescriptionList from '../../components/DescriptionList';
import { easyDispatch, easyRouteTo } from '@/utils/easyDispatch';
import { getErrorMessage } from '../../common/convertError';
import { color } from '../../common/color';
import ChangePlayer from './modals/ChangePlayer';

const { Description } = DescriptionList;
const actionRef = React.createRef<ActionType>();

export interface P {
  loading: boolean;
  inviteList: PlayerStateType;
}

export interface S {
  error: string;
  modalError: string;
}

interface ProTableColumns {
  index: number;
  id: number;
  truename: string;
  idcard: string;
  bankcardnumber: string;
  nick: string;
  phone: number;
  gold: number;
  matchticket: number;
  clubid: number;
  prize: string;
  matchesplayed: number;
  matcheswon: number;
  conference_id: number;
  match_winning_rate: string;
  club_score: string;
  status: '0' | '1' | '-1';
  bankname: string;
  clubName: string;
  clubRanking: number;
  clubScore: number;
  conferenceName: string;
  conferenceRanking: number;
  countryRanking: number;
  hongFen: number;
  jinFen: number;
  lanFen: number;
  leagueName: string;
  leagueRanking: number;
  matchNum: number;
  matchWinningRate: number;
  yinFen: number;
}

class Player extends React.Component<P, S> {
  state = {
    error: '',
    modalError: '',
    userInfo: {},
  };

  componentDidMount() {
    // 获取 UserId
    const id = location.pathname.split('/').pop();
    this.setState({ userInfo: { id } }, () => {
      actionRef!.current!.reloadAndRest();
      // reload: (resetPageIndex?: boolean) => void;
      // reloadAndRest: () => void;
      // fetchMore: () => void;
      // reset: () => void;
      // clearSelected: () => void;
    });
  }

  // componentWillReceiveProps(newProps) {
  //   const id = newProps.match.params.id;
  //   // 一些操作
  //   console.log(id);
  //   easyDispatch(this, 'player/fetchInvite', {
  //     pageNum: 1,
  //     pageSize: 10,
  //     userId: id,
  //     onError: this.onError.bind(this),
  //   });
  // }

  onLuckUser(id: number, status: number) {
    this.clearError();
    easyDispatch(this, 'player/changePlayer', {
      id,
      status,
      onError: this.onError.bind(this),
      onOk: () => {
        message.success('操作成功!');
        actionRef!.current!.reload();
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

  clearError() {
    this.setState({ error: '', modalError: '' });
  }

  render() {
    const { error, modalError, userInfo } = this.state;
    console.log(userInfo);

    const columns: ProColumns<ProTableColumns>[] = [
      {
        title: '编号',
        dataIndex: 'id',
        valueType: 'text',
      },
      {
        title: '昵称',
        dataIndex: 'nick',
        key: 'nick',
        copyable: true,
        ellipsis: true,
        valueType: 'text',
        // hideInSearch: true,
        render: (_, row) => (row.nick ? row.nick : '--'),
      },
      {
        title: '真实姓名',
        dataIndex: 'truename',
        key: 'truename',
        copyable: true,
        ellipsis: true,
        valueType: 'text',
        render: (_, row) => (row.truename ? row.truename : '--'),
      },
      {
        title: '所属渠道',
        dataIndex: 'clubName',
        key: 'clubName',
        ellipsis: true,
        valueType: 'text',
        hideInSearch: true,
      },

      /** 用于表单搜索，不在 Table 里展示 */
      {
        title: '身份证号',
        dataIndex: 'idcard',
        key: 'idcard',
        copyable: true,
        ellipsis: true,
        hideInTable: true,
        valueType: 'text',
      },
      /** 用于表单搜索，不在 Table 里展示 */
      // {
      //   title: '银行卡号',
      //   dataIndex: 'bankcardnumber',
      //   key: 'bankcardnumber',
      //   hideInTable: true,
      //   valueType: 'text',
      // },

      {
        title: '等级',
        dataIndex: 'lv',
        key: 'lv',
        valueType: 'text',
      },
      {
        title: '经验',
        dataIndex: 'exp',
        valueType: 'text',
      },
      {
        title: '手机',
        dataIndex: 'phone',
        valueType: 'text',
      },
      {
        title: '推广人数',
        dataIndex: 'firstSpread',
        key: 'firstSpread',
        valueType: 'text',
        hideInSearch: true,
      },
      {
        title: '金豆',
        dataIndex: 'gold',
        key: 'gold',
        copyable: true,
        ellipsis: true,
        valueType: 'text',
        hideInSearch: true,
        render: (_, row) => (row.gold ? row.gold : '--'),
      },

      {
        title: '兑换券',
        dataIndex: 'prize',
        key: 'prize',
        valueType: 'text',
        hideInSearch: true,
      },
      {
        title: '推广充值总额',
        dataIndex: 'spreadPrice',
        key: 'spreadPrice',
        valueType: 'money',
        hideInSearch: true,
      },
      {
        title: '状态',
        dataIndex: 'status',
        initialValue: '0',
        key: 'status',
        hideInSearch: true,
        valueEnum: {
          0: { text: '未认证', status: 'Warning' },
          1: { text: '正常', status: 'Success' },
          '-1': { text: '封停', status: 'Error' },
        },
      },
      {
        title: '邀请者',
        dataIndex: 'pName',
        key: 'pName',
        ellipsis: true,
        valueType: 'text',
        hideInSearch: true,
      },
      {
        title: '操作',
        valueType: 'option',
        dataIndex: 'id',
        align: 'right',
        render: (text, row, _, action) => (
          <Fragment>
            <span style={{ marginRight: 10 }}>
              <span
                style={{ cursor: 'pointer', color: color.link }}
                onClick={e => easyRouteTo(this, `/player/record/${row.id}}`)}
              >
                <Icon type="eye" style={{ marginRight: 2 }} /> 充值记录
              </span>
            </span>
            {row.status.toString() == '-1' ? (
              <Popconfirm
                title={
                  <span>
                    确认解封 <b>{row.nick}</b> 吗?
                  </span>
                }
                onConfirm={this.onLuckUser.bind(this, row.id, 1)}
                okType="danger"
                okText="确认"
                cancelText="取消"
              >
                <span style={{ cursor: 'pointer', color: color.success }}>
                  <Icon type="unlock" style={{ marginRight: 4 }} />
                  <span>解封</span>
                </span>
              </Popconfirm>
            ) : (
              <Popconfirm
                title={
                  <span>
                    确认封停<b>{row.nick}</b> 吗?
                  </span>
                }
                onConfirm={this.onLuckUser.bind(this, row.id, -1)}
                okType="danger"
                okText="确认"
                cancelText="取消"
              >
                <span style={{ cursor: 'pointer', color: color.error }}>
                  <Icon type="lock" style={{ marginRight: 4 }} />
                  <span>封停</span>
                </span>
              </Popconfirm>
            )}
          </Fragment>
        ),
      },
    ];
    return (
      <PageHeaderWrapper content={<div>此处可以管理玩家.</div>}>
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
                    actionRef!.current!.reset(), this.clearError();
                  }}
                >
                  <b>刷新页面</b>
                </a>
              </span>
            }
          />
        )}
        <Card bordered={false} loading={false}>
          <ProTable<ProTableColumns>
            columns={columns}
            expandedRowRender={expandedRowRender}
            // @ts-ignore
            actionRef={actionRef}
            request={async (params = {}) => {
              const { current, pageSize, nick, truename, idcard, bankcardnumber, id } =
                params || {};
              const userId = location.pathname.split('/').pop();
              // 1.执行 effects 方法获取数据
              await easyDispatch(this, 'player/fetchInvite', {
                pageNum: current,
                pageSize,
                nick,
                id,
                truename,
                idcard,
                bankcardnumber,
                userId: id || userId,
                onError: this.onError.bind(this),
              });
              // 2.获取列表数据
              const { inviteList } = await this.props;
              return {
                data: inviteList!.list,
                page: params.current,
                success: true,
                total: inviteList.total as number,
              };
            }}
            rowKey="id"
            pagination={{ showSizeChanger: true }}
            dateFormatter="string"
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

// @ts-ignore
export default connect(
  ({
    player: { inviteList },
    loading,
  }: {
    player: PlayerStateType;
    loading: {
      effects: {
        [key: string]: boolean;
      };
    };
  }) => ({
    inviteList,
    loading: loading.effects['player/fetchInvite'],
  }),
)(Player);

function expandedRowRender(data: any) {
  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <DescriptionList
        size="large"
        title={<span>详细信息 :</span>}
        style={{ marginBottom: 32 }}
        layout="horizontal"
        col={1}
      >
        <Description term="注册时间">
          {data.signuptime ? moment(data.signuptime, 'X').format('YYYY-MM-DD HH:mm') : '--'}
        </Description>
        <Description term="最后登录时间">
          {data.signtime ? moment(data.signtime, 'X').format('YYYY-MM-DD HH:mm') : '--'}
        </Description>
      </DescriptionList>
      <DescriptionList
        size="large"
        title={<span>分数信息 :</span>}
        style={{ marginBottom: 32 }}
        layout="horizontal"
        col={1}
      >
        <Description term="钻石">{data.roomcard || '--'}</Description>
        <Description term="金币">{data.gold || '--'}</Description>
        <Description term="兑换券">{data.matchticket || '--'}</Description>
      </DescriptionList>
    </div>
  );
}

import React, { Fragment } from 'react';
import _ from 'lodash';
import moment from 'moment';
import { connect } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Alert } from 'antd';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { PlayerStateType } from '../../models/player';
import { easyDispatch, easyRouteTo } from '@/utils/easyDispatch';
import { COMMODITY_TYPE } from '../../common/convert'
import { getErrorMessage } from '../../common/convertError';

const actionRef = React.createRef<ActionType>();

export interface P {
  loading: boolean;
  record: PlayerStateType;
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
    console.log(id)
    this.setState(
      {
        userInfo: { id },
      },
      () => {
        easyDispatch(this, 'player/fetchRecord', {
          pageNum: 1,
          pageSize: 10,
          playerId: this.state.userInfo.id,
          onError: this.onError.bind(this),
        });
      },
    );
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
    const { error, userInfo } = this.state;
    console.log(userInfo);

    // 充值类型
    const PLATFORM_TYPE = {
      'wechatgame': '微信小游戏',
      1: '微信公众号网页',
      2: 'APP'
    }

    const columns: ProColumns<ProTableColumns>[] = [
      {
        title: '用户编号',
        dataIndex: 'userid',
        valueType: 'text',
      },
      {
        title: '商品',
        key: 'itemid',
        copyable: true,
        ellipsis: true,
        valueType: 'text',
        hideInSearch: true,
        render: (_, row) => (row.itemid ? COMMODITY_TYPE[row.itemid] : '--'),
      },
      {
        title: '充值金额',
        dataIndex: 'fee',
        ellipsis: true,
        valueType: 'text',
        hideInSearch: true,
      },
      {
        title: '充值类型',
        dataIndex: 'platform',
        valueType: 'text',
        hideInSearch: true,
        render: (_, row) =>
          PLATFORM_TYPE[row.platform] || '--',
      },
      {
        title: '通知时间',
        dataIndex: 'notifytime',
        valueType: 'text',
        hideInSearch: true,
        render: (_, row) =>
          row.notifytime ? moment(row.notifytime, 'X').format('YYYY-MM-DD HH:mm') : '--',
      },
      {
        title: '创建时间',
        dataIndex: 'createtime',
        valueType: 'text',
        hideInSearch: true,
        render: (_, row) =>
          row.createtime ? moment(row.createtime, 'X').format('YYYY-MM-DD HH:mm') : '--',
      }
    ];

    return (
      <PageHeaderWrapper>
        {error && (
          <Alert
            message="获取充值记录失败！"
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
            // @ts-ignore
            actionRef={actionRef}
            request={async (params = {}) => {
              const { current, pageSize, nick, truename, idcard, bankcardnumber, id } =
                params || {};
              // 1.执行 effects 方法获取数据
              await easyDispatch(this, 'player/fetchRecord', {
                pageNum: current,
                pageSize,
                nick,
                id,
                truename,
                idcard,
                bankcardnumber,
                playerId: userInfo.id,
                onError: this.onError.bind(this),
              });
              // 2.获取列表数据
              const { record } = await this.props;
              return {
                data: record!.list,
                page: params.current,
                success: true,
                total: record.total as number,
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
    player: { record },
    loading,
  }: {
    player: PlayerStateType;
    loading: {
      effects: {
        [key: string]: boolean;
      };
    };
  }) => ({
    record,
    loading: loading.effects['player/fetchRecord'],
  }),
)(Player);

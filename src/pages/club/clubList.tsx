import React, { Fragment } from 'react';
import _ from 'lodash';
import { Base64 } from 'js-base64';
import { connect } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Alert, Icon, message, Popconfirm, Row, Col } from 'antd';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { easyDispatch, easyRouteTo } from '@/utils/easyDispatch';
import { getErrorMessage } from '../../common/convertError';
import AvatarIcon from '../../components/AvatarIcon';
import { color } from '../../common/color';
import styles from './styles.less';
import OnbindClubToOrganizer from './modals/OnbindClubToOrganizer';

// 获取 React 元素
const actionRef = React.createRef<ActionType>();

interface GithubIssueItem {
  url: string;
  repository_url: string;
  labels_url: string;
  comments_url: string;
  events_url: string;
  html_url: string;
  id: number;
  node_id: string;
  number: number;
  title: string;
  user: User;
  labels: Label[];
  state: string;
  locked: boolean;
  assignee?: any;
  assignees: any[];
  milestone?: any;
  comments: number;
  created_at: string;
  updated_at: string;
  closed_at?: any;
  author_association: string;
  body: string;
}

interface Label {
  id: number;
  node_id: string;
  url: string;
  name: string;
  color: string;
  default: boolean;
  description: string;
}

interface User {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
}

const Info: React.FC<{
  title: React.ReactNode;
  value: React.ReactNode;
  bordered?: boolean;
}> = ({ title, value, bordered }) => (
  <div className={styles.headerInfo}>
    <span>{title}</span>
    <p>{value}</p>
    {bordered && <em />}
  </div>
);

// @ts-ignore
@connect(({ club, organizer, user }) => ({ club, organizer, user }))
export default class Club extends React.Component {
  state = {
    error: '',
    modalError: '',
  };

  componentDidMount() {
    this.queryClubNumber();
    this.queryOrganizerSelect();
  }

  onError(response) {
    this.setState({ error: getErrorMessage(response) });
  }
  onModalError(response) {
    this.setState({ modalError: getErrorMessage(response) });
  }
  clearError() {
    this.setState({ error: '', modalError: '' });
  }

  // 获取统计数据
  queryClubNumber() {
    this.clearError();
    easyDispatch(this, 'club/fetchClubNumber');
  }

  // 获取改绑下拉列表
  queryOrganizerSelect() {
    this.clearError();
    easyDispatch(this, 'organizer/fetchOrganizerSelect', {
      onError: () => message.error('获取渠道下拉列表失败!'),
    });
  }

  onLuckUser(groupId, status) {
    this.clearError();
    easyDispatch(this, 'user/changeUserState', {
      groupId,
      status,
      groupType: 0, // 当前群体类型为协办方
      onError: this.onError.bind(this),
      onOk: () => {
        message.success('操作成功!');
        actionRef!.current!.reload();
      },
    });
  }

  OnbindClubToOrganizer(id, v, callback) {
    this.clearError();
    easyDispatch(this, 'club/changeClub', {
      ..._.pick(v, 'leagueId'),
      id,
      onError: code => {
        callback(false); // don't close
        this.onModalError(code);
      },
      onOk: () => {
        callback(true);
        message.success('改绑成功!');
        actionRef!.current!.reload();
      },
    });
  }

  onSkip(id, e) {
    e.preventDefault();
    const param = Base64.encodeURI(JSON.stringify({ back2: '/club-manager/list' }));
    // @ts-ignore;
    easyRouteTo(this, `/club-manager/detail/${id}-${param}`);
  }

  render() {
    const { error, modalError } = this.state;
    const { clubNumber } = this.props.club || {};
    const { organizerSelect } = this.props.organizer || [];

    const columns: ProColumns<GithubIssueItem>[] = [
      // {
      //   title: '序号',
      //   dataIndex: 'index',
      //   valueType: 'indexBorder',
      //   width: 80,
      // },
      {
        title: 'logo',
        key: 'logoUrl',
        dataIndex: 'logoUrl',
        hideInSearch: true,
        render: (_, row) => <AvatarIcon iconURL={row.logoUrl} name={row.name} />,
      },
      {
        title: '协办方名称',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        valueType: 'text',
      },
      {
        title: '所属渠道',
        dataIndex: 'competitionName',
        key: 'competitionName',
        ellipsis: true,
        valueType: 'text',
        hideInSearch: true,
        render: (text, row, _, action) => (
          <span>
            <OnbindClubToOrganizer
              error={modalError}
              organizerSelect={organizerSelect}
              onShowAsync={() => this.clearError()}
              onOk={this.OnbindClubToOrganizer.bind(this, row.id)}
            >
              <span style={{ cursor: 'pointer', color: color.link }}>
                <span>{row.competitionName}</span>
              </span>
            </OnbindClubToOrganizer>
          </span>
        ),
      },
      {
        title: '选手数',
        dataIndex: 'peopleNumber',
        key: 'peopleNumber',
        ellipsis: true,
        valueType: 'text',
        hideInSearch: true,
      },
      {
        title: '排名',
        dataIndex: 'ranking',
        key: 'ranking',
        ellipsis: true,
        valueType: 'text',
        hideInSearch: true,
      },
      {
        title: '分数',
        dataIndex: 'points',
        key: 'points',
        ellipsis: true,
        valueType: 'text',
        hideInSearch: true,
      },
      {
        title: '兑换券池金额',
        dataIndex: 'bonus',
        key: 'bonus',
        valueType: 'money',
        hideInSearch: true,
      },
      {
        title: '返利金额',
        dataIndex: 'rebateAmount',
        key: 'rebateAmount',
        valueType: 'money',
        hideInSearch: true,
      },
      {
        title: '已完成赛事数',
        dataIndex: 'tournamentNumber',
        key: 'tournamentNumber',
        valueType: 'text',
        hideInSearch: true,
      },

      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: 100,
        valueEnum: {
          '-1': { text: '封停', status: 'Error' },
          1: { text: '已认证', status: 'Success' },
        },
      },
      {
        title: '操作',
        valueType: 'option',
        dataIndex: 'id',
        align: 'right',
        render: (text, row, _, action) => (
          <Fragment>
            <span>
              <OnbindClubToOrganizer
                error={modalError}
                organizerSelect={organizerSelect}
                onShowAsync={() => this.clearError()}
                onOk={this.OnbindClubToOrganizer.bind(this, row.id)}
              >
                <span style={{ cursor: 'pointer', color: color.link }}>
                  <Icon type="link" style={{ marginRight: 4 }} />
                  <span>改绑</span>
                </span>
              </OnbindClubToOrganizer>
            </span>

            <span style={{ marginLeft: 10 }}>
              {row.status == -1 ? (
                <Popconfirm
                  title={
                    <span>
                      确认解封 <b>{row.name}</b> 吗?
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
                      确认封停<b>{row.name}</b> 吗?
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
            </span>
            <span style={{ marginLeft: 10 }}>
              <span
                style={{ cursor: 'pointer', color: color.link }}
                onClick={e => this.onSkip(row.id, e)}
              >
                <Icon type="eye" style={{ marginRight: 2 }} /> 查看详细
              </span>
            </span>
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderWrapper
      // content={<div>此处可添加兑换券池.</div>}
      // extraContent={<NewBonus onShowAsync={() => this.clearError()} onOk={this.onAddBonus.bind(this)} error={modalError} />}
      >
        <Card bordered={false} className={styles.top_card}>
          <Row>
            <Col sm={8} xs={24}>
              <Info title="今日新增协办方数" value={clubNumber.todayClubs || '--'} bordered />
            </Col>
            <Col sm={8} xs={24}>
              <Info title="本月新增协办方数" value={clubNumber.monthClubs || '--'} bordered />
            </Col>
            <Col sm={8} xs={24}>
              <Info title="协办方总数" value={clubNumber.clubs || '--'} />
            </Col>
          </Row>
        </Card>
        {error ? (
          <Alert
            message="获取兑换券池列表失败"
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
          <>
            <Card bordered={false}>
              <ProTable<GithubIssueItem>
                columns={columns}
                actionRef={actionRef}
                request={async (params = {}) => {
                  const { current, pageSize } = params || {};
                  // 1.执行 effects 方法获取数据
                  await easyDispatch(this, 'club/fetchClub', {
                    pageNum: current,
                    pageSize,
                    ...params,
                    onError: this.onError.bind(this),
                  });
                  // 2.获取列表数据
                  const { clubList } = await this.props.club;
                  return {
                    data: clubList!.list,
                    page: params.current,
                    success: true,
                    total: clubList.total as number,
                  };
                }}
                rowKey="id"
                pagination={{ showSizeChanger: true }}
                dateFormatter="string"
              />
            </Card>
          </>
        )}
      </PageHeaderWrapper>
    );
  }
}

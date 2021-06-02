import React, { Fragment } from 'react';
import _ from 'lodash';
import { Base64 } from 'js-base64';
import { connect } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Alert, Icon, DatePicker, message, Popconfirm, Row, Col, Progress } from 'antd';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { ORGANIZER_STATE_MAP } from '../../common/convert';
import { easyDispatch, easyRouteTo } from '@/utils/easyDispatch';
import { getErrorMessage } from '../../common/convertError';
import AvatarIcon from '../../components/AvatarIcon';
import { color } from '../../common/color';
import styles from './styles.less';
import ChangeClubState from './modals/ChangeClubState';
import NewClubUser from './modals/NewClubUser';

const { RangePicker } = DatePicker;
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
@connect(({ club, user }) => ({ club, user }))
export default class Club extends React.Component {
  state = {
    error: '',
    modalError: '',
  };

  componentDidMount() {
    this.queryClubNumber();
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

  onChangeClubState(id, v, callback) {
    this.clearError();
    easyDispatch(this, 'club/changeClub', {
      ..._.pick(v, 'status'),
      id,
      onError: code => {
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

  onDeleteClub(id) {
    this.clearError();
    easyDispatch(this, 'club/deleteClub', {
      id,
      onError: this.onError.bind(this),
      onOk: () => {
        message.success('删除成功!');
        actionRef!.current!.reload();
      },
    });
  }

  onAddClubUser(v, callback) {
    this.clearError();
    // @ts-ignore
    easyDispatch(this, 'user/addUsers', {
      ..._.pick(v, 'username', 'password', 'bz', 'authFee'),
      userStatus: 2, // 主办方添加渠道时传入状态
      onError: code => {
        callback(false); // don't close
        this.onModalError(code);
      },
      onOk: () => {
        callback(true);
        message.success('添加成功!');
        // @ts-ignore;
        actionRef!.current!.reload();
      },
    });
  }

  onSkip(id, e) {
    e.preventDefault();
    const param = Base64.encodeURI(JSON.stringify({ back2: '/club-manager/unverifiedList' }));
    // @ts-ignore;
    easyRouteTo(this, `/club-manager/detail/${id}-${param}`);
  }

  render() {
    const { error, modalError } = this.state;
    const { clubNumber } = this.props.club || {};

    const columns: ProColumns<GithubIssueItem>[] = [
      {
        title: '序号',
        dataIndex: 'index',
        valueType: 'indexBorder',
        width: 80,
      },
      {
        title: 'logo',
        key: 'logoUrl',
        dataIndex: 'logoUrl',
        hideInSearch: true,
        render: (_, row) => <AvatarIcon iconURL={row.logoUrl} name={row.name} />,
      },
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        valueType: 'text',
      },
      {
        title: '认证费',
        dataIndex: 'authFee',
        key: 'authFee',
        ellipsis: true,
        valueType: 'money',
        hideInSearch: true,
      },
      {
        title: '创建时间',
        key: 'authTime',
        dataIndex: 'authTime',
        valueType: 'dateTime',
        renderFormItem: (item, props) => (
          <RangePicker defaultValue={null} onChange={e => props.onChange(e)} />
        ),
      },
      {
        title: '状态',
        key: 'statu',
        dataIndex: 'statu',
        hideInSearch: true,
        render: (_, row) => (
          <Progress
            percent={ORGANIZER_STATE_MAP[row.status].progress}
            format={() =>
              `${ORGANIZER_STATE_MAP[row.status].name} ${ORGANIZER_STATE_MAP[row.status].icon}`
            }
          />
        ),
      },

      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: 100,
        hideInTable: true,
        valueEnum: {
          0: { text: '待审核', status: 'Warning' },
          1: { text: '已认证', status: 'Success' },
          2: { text: '封停', status: 'Error' },
          3: { text: '待缴费', status: 'Processing' },
          4: { text: '待认证', status: 'Default' },
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
              <ChangeClubState
                error={modalError}
                info={row}
                onShowAsync={() => this.clearError()}
                onOk={this.onChangeClubState.bind(this, row.id)}
              >
                <span style={{ cursor: 'pointer', color: color.link }}>
                  <Icon type="audit" style={{ marginRight: 4 }} />
                  <span>审核</span>
                </span>
              </ChangeClubState>
            </span>
            <span style={{ marginLeft: 10 }}>
              <Popconfirm
                title={
                  <span>
                    确认删除 <b>{row.name}</b> 吗?
                  </span>
                }
                onConfirm={this.onDeleteClub.bind(this, row.id)}
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
        content={<div>.</div>}
        extraContent={
          <NewClubUser
            onShowAsync={() => this.clearError()}
            onOk={this.onAddClubUser.bind(this)}
            error={modalError}
          />
        }
      >
        <Card bordered={false} className={styles.top_card}>
          <Row>
            <Col sm={8} xs={24}>
              <Info title="今日新增渠道数" value={clubNumber.todayConference || '--'} bordered />
            </Col>
            <Col sm={8} xs={24}>
              <Info title="本月新增渠道数" value={clubNumber.monthConference || '--'} bordered />
            </Col>
            <Col sm={8} xs={24}>
              <Info title="渠道总数" value={clubNumber.conferences || '--'} bordered />
            </Col>
          </Row>
        </Card>
        {error ? (
          <Alert
            message="获取协办方待认证列表失败"
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
            <Card bordered={false} loading={false}>
              <ProTable<GithubIssueItem>
                options={{ fullScreen: true, reload: true, setting: true }}
                columns={columns}
                actionRef={actionRef}
                request={async (params = {}) => {
                  const { current, pageSize, name, rangePicker, status } = params || {};
                  // const [beginTimeL, endTimeL] = rangePicker ? [moment(rangePicker[0]).format("x"), moment(rangePicker[1]).format("x")] : [null, null]
                  // 1.执行 effects 方法获取数据
                  await easyDispatch(this, 'club/fetchUnverified', {
                    pageNum: current,
                    pageSize,
                    // beginTimeL, endTimeL,
                    name,
                    status,
                    onError: this.onError.bind(this),
                  });
                  // 2.获取列表数据
                  const { unverifiedList } = await this.props.club;
                  return {
                    data: unverifiedList!.list,
                    page: params.current,
                    success: true,
                    total: unverifiedList.total as number,
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

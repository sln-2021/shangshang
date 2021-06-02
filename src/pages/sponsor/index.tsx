import React, { Fragment } from 'react';
import _ from 'lodash';
import { connect } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Alert, Icon, message, Popconfirm, Button } from 'antd';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { history as router } from 'umi';
import { easyDispatch } from '@/utils/easyDispatch';
import { getErrorMessage } from '../../common/convertError';
import AvatarIcon from '../../components/AvatarIcon';
import { color } from '../../common/color';
import ChangeSponsorUser from './modals/ChangeSponsorUser';

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

// @ts-ignore
@connect(({ sponsor, user }) => ({ sponsor, user }))
export default class Sponsor extends React.Component {
  state = {
    error: '',
    modalError: '',
  };

  onError(response) {
    this.setState({ error: getErrorMessage(response) });
  }
  onModalError(response) {
    this.setState({ modalError: getErrorMessage(response) });
  }
  clearError() {
    this.setState({ error: '', modalError: '' });
  }

  onAddSponsorManagerUser(v, callback) {
    this.clearError();
    // @ts-ignore
    easyDispatch(this, 'user/addUsers', {
      ..._.pick(v, 'username', 'password', 'bz', 'authFee'),
      userStatus: 1, // 主办方添加渠道时传入状态
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

  onChangeSponsorUser(id, v, callback) {
    this.clearError();
    easyDispatch(this, 'sponsor/changeSponsor', {
      ..._.pick(v, 'name'),
      id,
      // 二进制文件数据
      logoFile: v!.logoFile && v.logoFile.fileList[0] ? v.logoFile.fileList[0].originFileObj : null,
      onError: code => {
        callback(false); //don't close
        this.onModalError(code);
      },
      onOk: () => {
        callback(true);
        message.success('修改成功!');
        actionRef!.current!.reload();
      },
    });
  }

  onLuckUser(groupId, status) {
    this.clearError();
    easyDispatch(this, 'user/changeUserState', {
      groupId,
      status,
      groupType: 2, // 当前群体类型为渠道
      onError: () => message.error('操作失败'),
      onOk: () => {
        message.success('操作成功!');
        actionRef!.current!.reload();
      },
    });
  }

  render() {
    const { error, modalError } = this.state;

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
        title: '渠道名称',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        valueType: 'text',
        hideInSearch: true,
      },
      {
        title: '排名',
        dataIndex: 'rank',
        key: 'rank',
        ellipsis: true,
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
          1: { text: '正常', status: 'Success' },
        },
      },
      {
        title: '操作',
        valueType: 'option',
        dataIndex: 'id',
        align: 'right',
        render: (text, row, _, action) => (
          <Fragment>
            <span style={{ marginLeft: 10 }}>
              {row.status == '-1' ? (
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
              <ChangeSponsorUser
                error={modalError}
                info={row}
                onShowAsync={() => this.clearError()}
                onOk={this.onChangeSponsorUser.bind(this, row.id)}
              >
                <span style={{ cursor: 'pointer', color: color.link }}>
                  <Icon type="tool" style={{ marginRight: 4 }} />
                  <span>修改</span>
                </span>
              </ChangeSponsorUser>
            </span>
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderWrapper
        content={' '}
        extraContent={
          <Button
            icon="user-add"
            type="primary"
            onClick={() => router.push('/sponsor-manager/new-sponsor')}
          >
            {' '}
            添加主办方
          </Button>
        }
      >
        {error ? (
          <Alert
            message="获取主办方列表失败"
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
                  const { current, pageSize } = params || {};
                  // 1.执行 effects 方法获取数据
                  await easyDispatch(this, 'sponsor/fetchSponsor', {
                    pageNum: current,
                    pageSize,
                    ...params,
                    onError: this.onError.bind(this),
                  });
                  // 2.获取列表数据
                  const { sponsorList } = await this.props.sponsor;
                  return {
                    data: sponsorList!.list,
                    page: params.current,
                    success: true,
                    total: sponsorList.total as number,
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

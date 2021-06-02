import React, { Fragment } from 'react';
import _ from 'lodash';
import { Base64 } from 'js-base64';
import { connect } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Alert, Icon, Tag, message, Popconfirm } from 'antd';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { TYPE_ENUM_MAP } from '../../common/convert';
import IDPictures from '../../components/BaseComponents/IDPictures/index';
import { easyDispatch, easyRouteTo } from '@/utils/easyDispatch';
import { getErrorMessage } from '../../common/convertError';
import { color } from '../../common/color';
import ChangeBonus from './modals/ChangeBonus';
import NewBonus from './modals/NewBonus';

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
  actionRef: any;
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
@connect(({ bonus, user }) => ({ bonus, user }))
export default class Bonus extends React.Component {
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

  onDeleteBonus(id) {
    this.clearError();
    easyDispatch(this, 'bonus/deleteBonus', {
      id,
      onError: this.onError.bind(this),
      onOk: () => {
        message.success('删除成功!');
        actionRef!.current!.reload();
      },
    });
  }

  onChangeBonus(id, v, callback) {
    this.clearError();
    easyDispatch(this, 'bonus/changeBonus', {
      ..._.pick(v, 'bonusTotal'),
      id,
      // 二进制文件数据
      // file: v!.file && v.file.fileList[0] ? v.file.fileList[0].originFileObj : null,
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

  onPassBonus(id, status) {
    this.clearError();
    easyDispatch(this, 'bonus/changeBonus', {
      status,
      id,
      onError: () => {
        message.error('操作失败！');
      },
      onOk: () => {
        message.success('操作成功!');
        actionRef?.current?.reload();
      },
    });
  }

  onAddBonus(v, callback) {
    this.clearError();
    // @ts-ignore
    easyDispatch(this, 'bonus/addBonus', {
      ..._.pick(v, 'bonusTotal'),
      // 二进制文件数据
      file: v!.file && v.file.fileList[0] ? v.file.fileList[0].originFileObj : null,

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
    const param = Base64.encodeURI(JSON.stringify({ back2: '/bonus/list' }));
    // @ts-ignore;
    easyRouteTo(this, `/bonus/detail/${id}-${param}`);
  }

  // 权限判定
  onPermissions(status: number) {
    const { userInfo } = this.props.user;
    if (userInfo.userType === 'club' || userInfo.userType === 'superClub') return false;
    if (userInfo.userType === 'organizers' || userInfo.userType === 'superOrganizers') return false;
    if (Number(status) !== 0) return false;
    return true;
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
        title: '名称',
        dataIndex: 'groupName',
        key: 'groupName',
        copyable: true,
        ellipsis: true,
        valueType: 'text',
        hideInSearch: true,
        render: (_, row) => (row.groupName ? row.groupName : '--'),
      },
      {
        title: '缴纳金额',
        dataIndex: 'bonusTotal',
        key: 'bonusTotal',
        width: 200,
        valueType: 'money',
        hideInSearch: true,
      },
      {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        hideInSearch: true,
        render: (_, row) => (
          <Tag color={TYPE_ENUM_MAP[row.type].color}>{TYPE_ENUM_MAP[row.type].name}</Tag>
        ),
      },
      {
        title: '状态',
        dataIndex: 'status',
        initialValue: 'all',
        key: 'status',
        valueEnum: {
          all: { text: '全部', status: 'Default' },
          0: { text: '未审核', status: 'Warning' },
          1: { text: '通过', status: 'Success' },
          2: { text: '已拒绝', status: 'Error' },
        },
      },
      {
        title: '账单',
        dataIndex: 'flowUrl',
        key: 'flowUrl',
        hideInSearch: true,
        render: (_, row) => (row.flowUrl ? <IDPictures files={[{ url: row.flowUrl }]} /> : '--'),
      },

      {
        title: '创建时间',
        key: 'createTime',
        dataIndex: 'createTime',
        valueType: 'dateTime',
        hideInSearch: true,
      },
      {
        title: '操作',
        valueType: 'option',
        dataIndex: 'id',
        align: 'right',
        render: (text, row, _, action) => (
          <Fragment>
            {this.onPermissions(row.status) ? (
              <>
                <Popconfirm
                  title="请选择审核是否通过"
                  onConfirm={() => this.onPassBonus(row.id, 1)}
                  onCancel={() => this.onPassBonus(row.id, 2)}
                  okText="通过"
                  cancelText="拒绝"
                >
                  <a style={{ cursor: 'pointer', color: color.success }}>
                    <Icon type="audit" style={{ marginRight: 4 }} />
                    <span>审核</span>
                  </a>
                </Popconfirm>
                <span style={{ marginLeft: 10 }}>
                  <ChangeBonus
                    error={modalError}
                    info={row}
                    onShowAsync={() => this.clearError()}
                    onOk={this.onChangeBonus.bind(this, row.id)}
                  >
                    <span style={{ cursor: 'pointer', color: color.link }}>
                      <Icon type="tool" style={{ marginRight: 4 }} />
                      <span>修改</span>
                    </span>
                  </ChangeBonus>
                </span>
                <span style={{ marginLeft: 10 }}>
                  <Popconfirm
                    title={
                      <span>
                        确认删除 <b>{row.name}</b> 吗?
                      </span>
                    }
                    onConfirm={this.onDeleteBonus.bind(this, row.id)}
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
              </>
            ) : null}
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
        content={<div>此处可添加兑换券池.</div>}
        extraContent={
          <NewBonus
            onShowAsync={() => this.clearError()}
            onOk={this.onAddBonus.bind(this)}
            error={modalError}
          />
        }
      >
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
            <Card bordered={false} loading={false}>
              <ProTable<GithubIssueItem>
                columns={columns}
                actionRef={actionRef}
                request={async (params = {}) => {
                  const { current, pageSize, status } = params || {};
                  // 1.执行 effects 方法获取数据
                  await easyDispatch(this, 'bonus/fetchBonus', {
                    pageNum: current,
                    pageSize,
                    status,
                    onError: this.onError.bind(this),
                  });
                  // 2.获取列表数据
                  const { bonusList } = await this.props.bonus;
                  return {
                    data: bonusList!.list,
                    page: params.current,
                    success: true,
                    total: bonusList.total as number,
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

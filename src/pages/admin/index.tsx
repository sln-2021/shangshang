import React, { Fragment } from 'react';
import _ from 'lodash';
import { connect } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Alert, Icon, message, Popconfirm, Tag } from 'antd';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { UserModelState } from '../../models/user';
import { easyDispatch } from '@/utils/easyDispatch';
import { getErrorMessage } from '../../common/convertError';
import { color } from '../../common/color';
import NewUser from './modals/NewUser';

// 获取 React 元素
const actionRef = React.createRef<ActionType>();

interface ProTableColumns {
  index: number;
  id: number,
  username: string;
  userStatus: 0 | 1 | -1;
  isSuper: 0 | 1;
  bz: string;
  name: string,
  role: number
}

interface AddUserParams {
  username: string,
  password: String,
  bz: string,
  type: 'admin' | 'finance' | 'player'
}
type P = {
  adminUser: any
}

type S = {
  error: string;
  modalError: string
}

class Admin extends React.Component<P, S> {
  state = {
    error: '',
    modalError: '',
  };

  onDeletePlayer(id: number) {
    this.clearError();
    easyDispatch(this, 'user/deleteUser', {
      id,
      onError: this.onError.bind(this),
      onOk: () => {
        message.success('删除成功!');
        actionRef.current!.reload();
      },
    });
  }

  onAddUser(v: AddUserParams, callback: Function) {
    this.clearError();
    // @ts-ignore
    const { type } = v;
    switch (type) {
      case 'admin':
        easyDispatch(this, 'user/addUsers', {
          ..._.pick(v, 'username', 'password', 'bz'),
          userStatus: 1, // 添加同级管理员传 1
          onError: (code: Request) => {
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
        break;
      case 'finance':
        easyDispatch(this, 'user/addFinance', {
          ..._.pick(v, 'username', 'password', 'bz'),
          onError: (code: Request) => {
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
        break;
      case 'player':
        easyDispatch(this, 'user/addPlayer', {
          ..._.pick(v, 'username', 'password', 'bz'),
          onError: (code: Request) => {
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
        break;
      default: message.warning('添加出错')
        break;
    }
  }

  onChangeRestPassword(id: number) {
    this.clearError();
    easyDispatch(this, 'user/changeRestPassword', {
      id,
      onError: this.onError.bind(this),
      onOk: () => {
        message.success('操作成功!');
        actionRef!.current!.reload();
      },
    });
  }

  onLuckUser(id: number, status: number) {
    this.clearError();
    easyDispatch(this, 'user/changeUserInfo', {
      id,
      userStatus: status,
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
    const { error, modalError } = this.state;

    const columns: ProColumns<ProTableColumns>[] = [
      {
        title: '序号',
        dataIndex: 'index',
        valueType: 'indexBorder',
        width: 80,
      },
      {
        title: '用户名',
        dataIndex: 'username',
        copyable: true,
        ellipsis: true,
        valueType: 'text',
        render: (_, row) => (row.username ? row.username : '--'),
      },

      {
        title: '角色类型',
        dataIndex: 'role',
        hideInSearch: true,
        valueEnum: {
          1: { text: 'Root ', status: 'Default' },
          2: { text: '赛区', status: 'Processing' },
          3: { text: '渠道', status: 'Warning' },
          5: { text: '财务', status: 'Success' },
          6: { text: '运营', status: 'Success' }
        },
      },
      {
        title: '用户类型',
        dataIndex: 'isSuper',
        copyable: true,
        ellipsis: true,
        valueType: 'text',
        hideInSearch: true,
        render: (_, row) =>
          row.isSuper ? (
            <Tag color="#2db7f5"> 超级管理员</Tag>
          ) : (
              <Tag color="#f50"> 普通管理员</Tag>
            ),
      },
      {
        title: '备注',
        dataIndex: 'bz',
        valueType: 'text',
        hideInSearch: true,
      },
      {
        title: '状态',
        dataIndex: 'userStatus',
        initialValue: '0',
        hideInSearch: true,
        valueEnum: {
          0: { text: '未认证', status: 'Warning' },
          1: { text: '正常', status: 'Success' },
          '-1': { text: '封停', status: 'Error' },
        },
      },
      {
        title: '操作',
        valueType: 'option',
        dataIndex: 'id',
        align: 'right',
        render: (text, row, _, action) => (
          <Fragment>
            {row.userStatus == -1 ? (
              row.isSuper !== 1 ? (
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
                <span style={{ cursor: 'pointer', color: color.grey[7] }}>
                  <Icon type="lock" style={{ marginRight: 4 }} />
                  <span>解封</span>
                </span>
              )
            ) : row.isSuper !== 1 ? (
              <Popconfirm
                title={
                  <span>
                    确认封停<b>{row.username}</b> 吗?
                  </span>
                }
                onConfirm={() => this.onLuckUser(row.id, -1)}
                okType="danger"
                okText="确认"
                cancelText="取消"
              >
                <span style={{ cursor: 'pointer', color: color.error }}>
                  <Icon type="lock" style={{ marginRight: 4 }} />
                  <span>封停</span>
                </span>
              </Popconfirm>
            ) : (
              <span style={{ cursor: 'pointer', color: color.grey[7] }}>
                <Icon type="lock" style={{ marginRight: 4 }} />
                <span>封停</span>
              </span>
            )}

            {row.isSuper === 1 ? (
              <span style={{ marginLeft: 10 }}>
                <span style={{ cursor: 'pointer', color: color.grey[7] }}>
                  <Icon type="delete" style={{ marginRight: 4 }} />
                  <span>删除</span>
                </span>
              </span>
            ) : (
              <span style={{ marginLeft: 10 }}>
                <Popconfirm
                  title={
                    <span>
                      确认删除 <b>{row.username}</b> 吗?
                    </span>
                  }
                  onConfirm={this.onDeletePlayer.bind(this, row.id)}
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
            )}

            <span onClick={this.onChangeRestPassword.bind(this, row.id)} style={{ marginLeft: 10 }}>
              <span style={{ cursor: 'pointer', color: color.link }}>
                <Icon type="tool" style={{ marginRight: 4 }} />
                <span>重置密码</span>
              </span>
            </span>
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderWrapper
        content={<div>此处可以管理同级用户.</div>}
        extraContent={
          <NewUser
            onShowAsync={() => this.clearError()}
            onOk={this.onAddUser.bind(this)}
            error={modalError}
          />
        }
      >
        {error ? (
          <Alert
            message="获取同级管理员列表失败"
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
        ) : (
          <ProTable<ProTableColumns>
            columns={columns}
            // @ts-ignore
            actionRef={actionRef}
            request={async (params = {}) => {
              const { current, pageSize, username } = params || {};
              // 1.执行 effects 方法获取数据
              await easyDispatch(this, 'user/fetchAdminUsers', {
                pageNum: current,
                pageSize,
                username,
                onError: this.onError.bind(this),
              });
              // 2.获取列表数据
              const { adminUser } = await this.props;
              return {
                data: adminUser!.list,
                page: params.current,
                success: true,
                total: adminUser.total as number,
              };
            }}
            rowKey="id"
            pagination={{ showSizeChanger: true }}
            dateFormatter="string"
          />
        )}
      </PageHeaderWrapper>
    );
  }
}

// @ts-ignore
export default connect(
  ({
    user: { adminUser },
    loading,
  }: {
    user: UserModelState;
    loading: {
      effects: {
        [key: string]: boolean;
      };
    };
  }) => ({
    adminUser,
    loading: loading.effects['user/fetchAdminUsers'],
  }),
)(Admin);

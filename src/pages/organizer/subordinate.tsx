import React, { Fragment } from 'react';
import _ from 'lodash';
import { connect } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Alert, Icon, message, Popconfirm, Tag } from 'antd';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { UserModelState } from '../../models/user';
import { easyDispatch } from '@/utils/easyDispatch';
import { getErrorMessage } from '../../common/convertError';
import { color } from '../../common/color';

// 获取 React 元素
const actionRef = React.createRef<ActionType>();

class Player extends React.Component {
  state = {
    error: '',
    modalError: '',
  };

  onChangeRestPassword(id) {
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

  // 权限判定
  onPermissions() {
    const { userInfo } = this.props;
    if (userInfo.userType === 'admin' || userInfo.userType === 'superAdmin') {
      return {
        '-1': { text: '封停', status: 'Error' },
        0: { text: '渠道(待认证)', status: 'Warning' },
        1: { text: '正常', status: 'Success' },
        2: { text: '协办方(待认证)', status: 'Warning' },
        3: { text: '渠道(已提交)', status: 'Processing' },
        4: { text: '协办方(已提交)', status: 'Processing' },
        5: { text: '渠道(已拒绝)', status: 'Default' },
        6: { text: '协办方(已拒绝)', status: 'Default' },
      };
    }
    if (userInfo.userType === 'organizers' || userInfo.userType === 'superOrganizers') {
      return {
        '-1': { text: '封停', status: 'Error' },
        1: { text: '正常', status: 'Success' },
        2: { text: '协办方(待认证)', status: 'Warning' },
        4: { text: '协办方(已提交)', status: 'Processing' },
        6: { text: '协办方(已拒绝)', status: 'Default' },
      };
    }
    return null;
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

    const columns = [
      {
        title: '序号',
        dataIndex: 'index',
        valueType: 'indexBorder',
        width: 80,
      },
      {
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
        copyable: true,
        ellipsis: true,
        valueType: 'text',
        // hideInSearch: true,
        render: (_, row) => (row.username ? row.username : '--'),
      },
      {
        title: '状态',
        dataIndex: 'userStatus',
        initialValue: 'all',
        key: 'userStatus',
        valueEnum: this.onPermissions(),
      },
      {
        title: '所属渠道',
        dataIndex: 'groupName',
        key: 'groupName',
        ellipsis: true,
        valueType: 'text',
        hideInSearch: true,
      },
      {
        title: '备注',
        dataIndex: 'bz',
        key: 'bz',
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
      <PageHeaderWrapper content={<div>此处可以查看下级所有用户.</div>}>
        {error ? (
          <Alert
            message="获取下级列表失败"
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
              <ProTable
                columns={columns}
                // @ts-ignore
                actionRef={actionRef}
                request={async (params = {}) => {
                  const { current, pageSize, username, userStatus } = params || {};
                  // 1.执行 effects 方法获取数据
                  await easyDispatch(this, 'user/fetchSubordinate', {
                    pageNum: current,
                    pageSize,
                    username,
                    userStatus,
                    onError: this.onError.bind(this),
                  });
                  // 2.获取列表数据
                  const { subordinate } = await this.props;
                  return {
                    data: subordinate!.list,
                    page: params.current,
                    success: true,
                    total: subordinate.total as number,
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

// @ts-ignore
export default connect(
  ({
    user: { subordinate, userInfo },
    loading,
  }: {
    user: UserModelState;
    loading: {
      effects: {
        [key: string]: boolean;
      };
    };
  }) => ({
    subordinate,
    userInfo,
    loading: loading.effects['user/fetchAdminUsers'],
  }),
)(Player);

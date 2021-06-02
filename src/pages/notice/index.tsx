import React, { Fragment } from 'react';
import _ from 'lodash';
import moment from 'moment';
import { Base64 } from 'js-base64';
import { connect } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Alert, Icon, message, Popconfirm, Col, Row } from 'antd';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { StateType } from '../../models/notice';
import { easyDispatch, easyRouteTo } from '@/utils/easyDispatch';
import { getErrorMessage } from '../../common/convertError';
import styles from './styles.less';
import ChangePlayer from './modals/ChangePlayer';
import NewProvisionalNotice from './modals/NewProvisionalNotice';

// 获取 React 元素
const actionRef = React.createRef<ActionType>();

interface ProTableColumns {
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
  provisionalNotice: any;
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

export interface PlayerList {
  bz: string;
  id: number;
  userStatus: -1 | 0 | 1;
  username: string;
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

class Notice extends React.Component {
  state = {
    error: '',
    modalError: '',
  };

  onAddProvisionalNotice(v, callback) {
    this.clearError();
    // @ts-ignore
    easyDispatch(this, 'notice/addProvisionalNotice', {
      ..._.pick(v, 'rollingTimes', 'content'),
      dateTimeL: moment(v.dateTimeL).format('x'),
      onError: code => {
        callback(false); // don't close
        this.onModalError(code);
      },
      onOk: () => {
        callback(true);
        message.success('添加成功!');
        // @ts-ignore;
        actionRef.current!.reload();
      },
    });
  }

  onChangePlayer(id, v, callback) {
    this.clearError();
    easyDispatch(this, 'notice/changePlayer', {
      ..._.pick(v, 'bankcardnumber', 'bankname', 'phone'),
      id,
      onError: code => {
        callback(false); // don't close
        this.onModalError(code);
      },
      onOk: () => {
        callback(true);
        message.success('修改成功!');
        actionRef.current!.reload();
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
    const { provisionalNotice, notice, noticeDetail, lodaing } = this.props;

    const columns: ProColumns<ProTableColumns>[] = [
      {
        title: '序号',
        dataIndex: 'index',
        valueType: 'indexBorder',
        width: 80,
      },
      {
        title: '内容',
        dataIndex: 'content',
        key: 'content',
        copyable: true,
        ellipsis: true,
        valueType: 'text',
      },
      {
        title: '滚动次数',
        dataIndex: 'rollingTimes',
        key: 'rollingTimes',
        valueType: 'digit',
        hideInSearch: true,
      },
      {
        title: 'status',
        dataIndex: 'status',
        key: 'status',
        copyable: true,
        ellipsis: true,
        valueType: 'text',
        hideInSearch: true,
        hideInTable: true,
      },
      {
        title: 'cludIds',
        dataIndex: 'cludIds',
        key: 'cludIds',
        copyable: true,
        ellipsis: true,
        valueType: 'text',
        hideInSearch: true,
        hideInTable: true,
      },
      {
        title: 'conferenceIds',
        dataIndex: 'conferenceIds',
        key: 'conferenceIds',
        valueType: 'text',
        hideInSearch: true,
        hideInTable: true,
      },
      {
        title: 'dateTimeL',
        dataIndex: 'dateTimeL',
        key: 'dateTimeL',
        valueType: 'digit',
        hideInSearch: true,
        hideInTable: true,
      },
      {
        title: '创建时间',
        key: 'dateTime',
        dataIndex: 'dateTime',
        valueType: 'dateTime',
        hideInSearch: true,
      },
    ];

    return (
      <PageHeaderWrapper
        content={<div>此处可以管理临时公告.</div>}
        extraContent={
          <NewProvisionalNotice
            onShowAsync={() => this.clearError()}
            onOk={this.onAddProvisionalNotice.bind(this)}
            error={modalError}
          />
        }
      >
        {error ? (
          <Alert
            message="获取临时公告列表失败"
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
              <ProTable<ProTableColumns>
                columns={columns}
                // @ts-ignore
                actionRef={actionRef}
                request={async (params = {}) => {
                  const { current, pageSize, content } = params || {};
                  // 1.执行 effects 方法获取数据
                  await easyDispatch(this, 'notice/fetchProvisionalNotice', {
                    pageNum: current,
                    pageSize,
                    content,
                    onError: this.onError.bind(this),
                  });
                  // 2.获取列表数据
                  const { provisionalNotice } = await this.props;
                  return {
                    data: provisionalNotice!.list,
                    page: params.current,
                    success: true,
                    total: provisionalNotice.total as number,
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
    notice: { provisionalNotice, notice, noticeDetail },
    loading,
  }: {
    notice: StateType;
    loading: {
      effects: {
        [key: string]: boolean;
      };
    };
  }) => ({
    provisionalNotice,
    notice,
    noticeDetail,
    loading: loading.effects['notice/fetchProvisionalNotice'],
  }),
)(Notice);

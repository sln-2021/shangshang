import React, { Fragment } from 'react';
import _ from 'lodash';
import moment from 'moment';
import { connect } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Alert } from 'antd';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { easyDispatch, easyRouteTo } from '@/utils/easyDispatch';
import { getErrorMessage } from '../../common/convertError';

const actionRef = React.createRef<ActionType>();

export interface P {
  loading: boolean;
  mailDetail: any;
}

export interface S {
  error: string;
  propid: string;
}

class MailDetail extends React.Component<P, S> {
  state = {
    error: '',
    propid: '',
  };

  componentDidMount() {
    // 获取 UserId
    const id = location.pathname.split('/').pop();
    this.setState({ propid: id }, () => {
      easyDispatch(this, 'mail/fetchMailDetail', {
        pageNum: 1,
        pageSize: 10,
        propid: this.state.propid,
        onError: this.onError.bind(this),
      });
    });
  }

  // @ts-ignore
  onError(response: any) {
    this.setState({ error: getErrorMessage(response) });
  }

  clearError() {
    this.setState({ error: '' });
  }

  render() {
    const { error, propid } = this.state;

    // 充值类型
    const STATE = {
      0: '未完成/未领取',
      1: '已完成/已领取',
    };

    const columns: ProColumns[] = [
      {
        title: '玩家ID',
        dataIndex: 'playerid',
        valueType: 'text',
        hideInSearch: true,
      },

      {
        title: '发送时间',
        dataIndex: 'sendtime',
        valueType: 'text',
        hideInSearch: true,
        render: (_, row) =>
          row.sendtime ? moment(row.sendtime, 'X').format('YYYY-MM-DD HH:mm ss') : '--',
      },
      {
        title: '领取时间',
        dataIndex: 'gettime',
        valueType: 'text',
        hideInSearch: true,
        render: (_, row) =>
          row.gettime ? moment(row.gettime, 'X').format('YYYY-MM-DD HH:mm ss') : '--',
      },
      {
        title: '过期时间',
        dataIndex: 'endTime',
        valueType: 'text',
        hideInSearch: true,
        render: (_, row) =>
          row.endTime ? moment(row.endTime, 'X').format('YYYY-MM-DD HH:mm ss') : '--',
      },

      {
        title: '领取状态',
        dataIndex: 'state',
        valueType: 'text',
        hideInSearch: true,
        render: (_, row) => STATE[row.state] || '--',
      },
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
          <ProTable
            columns={columns}
            // @ts-ignore
            actionRef={actionRef}
            search={false}
            request={async (params = {}) => {
              const { current, pageSize } = params || {};
              // 1.执行 effects 方法获取数据
              await easyDispatch(this, 'mail/fetchMailDetail', {
                pageNum: current,
                pageSize,
                propid,
                onError: this.onError.bind(this),
              });
              // 2.获取列表数据
              const { mailDetail } = this.props;

              return {
                data: mailDetail!.list,
                page: params.current,
                success: true,
                total: mailDetail.total as number,
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
    mail: { mailDetail },
    loading,
  }: {
    mail: any;
    loading: {
      effects: {
        [key: string]: boolean;
      };
    };
  }) => ({
    mailDetail,
    loading: loading.effects['mail/fetchMailDetail'],
  }),
)(MailDetail);

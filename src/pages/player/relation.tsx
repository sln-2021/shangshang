import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Alert } from 'antd';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { getErrorMessage } from '../../common/convertError';
import { fetchPlayerById } from '../../services/player';

const actionRef = React.createRef<ActionType>();

export interface S {
  error: string;
}

interface ProTableColumns {
  id: number;
  len: number;
  sumpay: string;
}

export default class Relation extends React.Component<S> {
  state = { error: '' };

  // @ts-ignore
  onError(response: any) {
    this.setState({ error: getErrorMessage(response) });
  }

  clearError() {
    this.setState({ error: '' });
  }

  render() {
    const { error } = this.state;

    const columns: ProColumns<ProTableColumns>[] = [
      {
        title: '序号',
        dataIndex: 'id',
        valueType: 'indexBorder',
      },
      {
        title: '编号',
        dataIndex: 'id',
        valueType: 'text',
      },
      {
        title: '下线数',
        dataIndex: 'len',
        valueType: 'text',
        hideInSearch: true,
      },
      {
        title: '充值总数',
        dataIndex: 'sumpay',
        valueType: 'text',
        hideInSearch: true,
      },
    ];

    return (
      <PageHeaderWrapper>
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
            // @ts-ignore
            actionRef={actionRef}
            request={async (params = {}) => {
              const { id } = params || {};
              const data = await fetchPlayerById({ id });
              if (!data.error) return { data: [data] };
              return { data: [] };
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

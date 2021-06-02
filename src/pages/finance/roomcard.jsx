import { Icon } from '@ant-design/compatible';
import { Form } from '@ant-design/compatible';
/* eslint-disable react/jsx-no-bind */
import React, { Fragment } from 'react';
import moment from 'moment';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { message,  Tag } from 'antd';
import ProTable from '@ant-design/pro-table';
import { queryRoomcardList } from './service';

export default class Gold extends React.Component {
  render() {
    const columns = [
      {
        title: '注册',
        dataIndex: 'sum1',
        valueType: 'text',
      },
      {
        title: '礼物',
        dataIndex: 'sum2',
        valueType: 'text',
      },
      {
        title: '签到',
        dataIndex: 'sum3',
        valueType: 'text',
      },
      {
        title: '救济金',
        dataIndex: 'sum4',
        valueType: 'text',
      },
      {
        title: '任务',
        dataIndex: 'sum5',
        valueType: 'text',
      },
      {
        title: '充值',
        dataIndex: 'sum6',
        valueType: 'text',
      },
      {
        title: '兑换金币',
        dataIndex: 'sum7',
        valueType: 'text',
      },
      {
        title: '台位费',
        dataIndex: 'sum8',
        valueType: 'text',
      },
      {
        title: '比赛',
        dataIndex: 'sum9',
        valueType: 'text',
      },
      {
        title: '师徒',
        dataIndex: 'sum10',
        valueType: 'text',
      },
      {
        title: '奖券兑换实物',
        dataIndex: 'sum11',
        valueType: 'text',
      },
      {
        title: '总计',
        dataIndex: 'sumtotal',
        valueType: 'text',
      },
      {
        title: '时间',
        dataIndex: 'zerotime',
        hideInSearch: true,
        render: (_, row) => {
          const { zerotime } = row;
          return <Tag color="blue">{moment(zerotime, 'X').format('YYYY/MM/DD')}</Tag>;
        },
      },
    ];

    return (
      <PageHeaderWrapper>
        <ProTable
          search={false}
          columns={columns}
          request={async (params, sorter, filter) => {
            const data = await queryRoomcardList({
              ...params,
              sorter,
              filter,
              pageNum: params.current,
            });
            return {
              data: data.data.list,
              page: params.current,
              success: true,
              total: data.data.total,
            };
          }}
          rowKey="id"
          pagination={{ showSizeChanger: true }}
          dateFormatter="string"
        />
      </PageHeaderWrapper>
    );
  }
}

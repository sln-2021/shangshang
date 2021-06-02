import { Icon } from '@ant-design/compatible';
import { Form } from '@ant-design/compatible';
/* eslint-disable react/jsx-no-bind */
import React, { Fragment, useState, useRef, useEffect } from 'react';
import moment from 'moment';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { message,  Tag } from 'antd';
import ProTable from '@ant-design/pro-table';
import { COMMODITY_TYPE } from '../../common/convert'
import { queryPayRankList } from './service';

const PayRank = () => {
  const [total, setTotal] = useState('0')
  const columns = [
    {
      title: '用户编号',
      dataIndex: 'userid',
      valueType: 'text',
    },
    {
      title: '商品',
      key: 'itemid',
      copyable: true,
      ellipsis: true,
      valueType: 'text',
      hideInSearch: true,
      render: (_, row) => (row.itemid ? COMMODITY_TYPE[row.itemid] : '--'),
    },
    {
      title: '充值金额',
      dataIndex: 'fee',
      ellipsis: true,
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '充值类型',
      dataIndex: 'platform',
      valueEnum: {
        'wechatgame': { text: '小游戏', status: 'Warning' },
        1: { text: 'H5', status: 'Success' },
        2: { text: '安卓', status: 'Processing' },
        '': { text: '全部', status: 'Defaul' },
      },
    },
    {
      title: '通知时间',
      dataIndex: 'notifytime',
      valueType: 'text',
      hideInSearch: true,
      render: (_, row) =>
        row.notifytime ? moment(row.notifytime, 'X').format('YYYY-MM-DD HH:mm') : '--',
    },
    {
      title: '创建时间',
      dataIndex: 'createtime',
      valueType: 'text',
      hideInSearch: true,
      render: (_, row) =>
        row.createtime ? moment(row.createtime, 'X').format('YYYY-MM-DD HH:mm') : '--',
    },
    {
      title: '订单时间段',
      dataIndex: 'dateTimeRange',
      valueType: 'dateTimeRange',
      hideInTable: true,
    },
    {
      title: '状态',
      dataIndex: 'notifytime',
      hideInTable: true,
      valueEnum: {
        '0': { text: '失败', status: 'Error' },
        1: { text: '成功', status: 'Success' },
      },
    }
  ];

  return (
    <PageHeaderWrapper>
      <ProTable
        headerTitle={<h1>总金额：{total}</h1>}
        columns={columns}
        request={async (params, sorter, filter) => {

          let [createtimebegin, createtimeend] = [null, null];
          const { dateTimeRange } = params;

          if (dateTimeRange) {
            [createtimebegin, createtimeend] = [moment(dateTimeRange[0]).unix(), moment(dateTimeRange[1]).unix()];
          }

          const data = await queryPayRankList({
            ...params,
            playerId: params.userid,
            sorter,
            filter,
            pageNum: params.current,
            createtimebegin,
            createtimeend,
          });

          if (data.status === 400) return
          setTotal(data.data.total)

          return {
            data: data.data.list || [],
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


export default PayRank;
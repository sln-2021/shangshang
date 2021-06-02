import { Card, Table } from 'antd';
import React from 'react';
import { SearchDataType } from '../data.d';
import styles from '../style.less';

const columns = [
  {
    title: '组织',
    dataIndex: 'name',
    key: 'name',
    render: (text: React.ReactNode) => <a href="/">{text}</a>,
  },
  {
    title: '今日新增',
    dataIndex: 'new',
    key: 'new',
    className: styles.alignRight,
  },
  {
    title: '总计',
    dataIndex: 'total',
    key: 'total',
  },
];

const TopSearch = ({
  loading,
  searchData,
}: {
  loading: boolean;
  searchData: SearchDataType[];
}) => (
    <Card
      loading={loading}
      bordered={false}
      title="统计"
      style={{ height: '100%' }}
    >
      <Table<any>
        style={{ marginTop: '20px', marginBottom: '30px' }}
        rowKey={record => record.index}
        size="small"
        columns={columns}
        dataSource={searchData}
        pagination={false}
      />
    </Card>
  );

export default TopSearch;

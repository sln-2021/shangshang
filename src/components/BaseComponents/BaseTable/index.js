import { Icon } from '@ant-design/compatible';
//@ts-check
/// <reference path="../../../types.d.ts" />

/*
  这个组件 基于 src/components/StandardTable 修改而来

  1. 增加了 enableSelection 选项 (开启/关闭 选择功能)
  2. 增加了 footer

  Author: Liu Yue
  Update: 2018-05-29

  更新日志:
    2018-05-29: 支持了不显示分页指示器 (data.pagination=false)
*/

import React, { PureComponent, Fragment } from 'react';
import { Table, Alert } from 'antd';
import styles from './index.less';

function initTotalList(columns) {
  const totalList = [];
  columns.forEach(column => {
    if (column.needTotal) {
      totalList.push({ ...column, total: 0 });
    }
  });
  return totalList;
}

class BaseTable extends PureComponent {
  constructor(props) {
    super(props);
    const { columns } = props;
    const needTotalList = initTotalList(columns);

    this.state = {
      selectedRowKeys: [],
      needTotalList,
    };
  }

  componentWillReceiveProps(nextProps) {
    // clean state
    if (nextProps.selectedRows.length === 0) {
      const needTotalList = initTotalList(nextProps.columns);
      this.setState({
        selectedRowKeys: [],
        needTotalList,
      });
    }
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    let needTotalList = [...this.state.needTotalList];
    needTotalList = needTotalList.map(item => {
      return {
        ...item,
        total: selectedRows.reduce((sum, val) => {
          return sum + parseFloat(val[item.dataIndex]);
        }, 0),
      };
    });

    if (this.props.onSelectRow) {
      this.props.onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys, needTotalList });
  };

  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  };

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  };

  render() {
    const { selectedRowKeys, needTotalList } = this.state;
    const { data: { list, pagination }, loading, columns, rowKey, footer, expandedRowRender, inCardBody } = this.props;

    let { enableSelection } = this.props;
    if (typeof enableSelection === 'undefined')
      enableSelection = true;

    const paginationProps = pagination === false ? false : {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };

    const rowSelection = enableSelection ? {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    } : null;

    return (
      <div className={inCardBody ? styles.standardTableInCard : styles.standardTable}>
        <div className={styles.tableAlert}>
          {enableSelection ? (
            <Alert
              message={
                <Fragment>
                  已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
                  {needTotalList.map(item => (
                    <span style={{ marginLeft: 8 }} key={item.dataIndex}>
                      {item.title}总计&nbsp;
                      <span style={{ fontWeight: 600 }}>
                        {item.render ? item.render(item.total) : item.total}
                      </span>
                    </span>
                  ))}
                  <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }}>
                    清空
                  </a>
                </Fragment>
              }
              type="info"
              showIcon
            />
          ) : null}
        </div>
        <Table
          loading={loading}
          rowKey={rowKey || 'key'}
          expandedRowRender={expandedRowRender}
          rowSelection={rowSelection}
          dataSource={list}
          columns={columns}
          pagination={paginationProps}  // 页数显示
          onChange={this.handleTableChange}
          footer={footer}
        />
      </div>
    );
  }
}

export default BaseTable;

import { Icon } from '@ant-design/compatible';
//@ts-check
/// <reference path="../../../types.d.ts" />

/*
  CURD 表格组件 (extends BaseTable)

  Author: Liu Yue
  Update: 2018-07-18

  更新日志:
    2018-05-29: 支持了不显示分页指示器 (paginationProps={false})
    2018-06-04: 增加了 title
    2018-06-27: 增加了 bodyStyle
    2018-07-18: 添加了 cardProps 支持, 修复了创建按钮不存在时的留白隐藏
    2019-02-16: 修正了 jsDoc
*/

import React, { PureComponent } from 'react';
import {  Alert, Card } from 'antd';
import { Form } from '@ant-design/compatible';
import styles from './TableList.less';
import { pleaseContactDeveloper } from '../../../utils/pleaseContactDeveloper';
import { debugEcho } from '../../../utils/debug';
import BaseTable from '../BaseTable';

/**
 * @augments {PureComponent<{

      msgType?: "success"|"info"|"warning"|"error"|"";
      msg?: any;
      title?: any;
      bodyStyle?: any;
      cardProps?: any;

      loading: boolean;
      columns: AntdTableColumn[];
      keyColumn?: string|Function;
      defaultPageSize: number;

      header?: any;
      expandedRowRender?: any;

      data?: any[];
      paginationProps?: {}|false;

      springPageData?: any;

      queryFunction?: (page: number, size: number, filterForm: any, colFilter: any, colSorter: any) => any;

      enableSelection?: boolean;

      enableCreate?: boolean;
      createButtonComponent?: any;

      enableMutliAction?: boolean;
      createMultiAction?: (selectedRows: any[]) => any;

      enableFilter?: boolean;
      filterFormProps?: any;
      createFilter?: (form: any, styles: any) => any;
      currentFilter?: any;

      enableFooter?: boolean;

      form?: any;
    }, {}>}
 */
//@ts-ignore
@Form.create()
export class CRUDTableCard extends PureComponent {
  state = {
    selectedRows: [],
  };

  /** @param {Event} event */
  onFilterFromSubmit(event) {
    if (event && typeof event.preventDefault === 'function')
      event.preventDefault();

    this.props.form.validateFields((err, values) => {
      if (err) return;
      this.props.queryFunction(1, this.props.defaultPageSize, values, {}, {});
    });
  }

  onTableQueryChange(p, filtersArg, sorter) {
    const { currentFilter } = this.props;
    this.props.queryFunction(p.current, p.pageSize, currentFilter || {}, filtersArg, sorter);
  }

  render() {
    const { selectedRows } = this.state;
    const {
      enableCreate, enableMutliAction, enableFilter, enableSelection, enableFooter,
      columns, loading, springPageData, defaultPageSize, keyColumn,
      expandedRowRender, header, bodyStyle,
      msgType, msg, title, cardProps,
    } = this.props;

    let { data, paginationProps } = this.props;
    if (springPageData) {

      // 检查 Spring 分页数据是否有效
      if (!loading && Object.keys(springPageData).length > 0) {
        if (!('content' in springPageData) ||
          !('size' in springPageData) ||
          !('number' in springPageData)) {

          pleaseContactDeveloper('无效的Spring分页数据! (缺少 content, size 或是 number)');
        }
      }

      data = springPageData.content || [];
      paginationProps = {
        // StandardTable has these two attributes:
        //  showSizeChanger: true,
        //  showQuickJumper: true,
        total: springPageData.totalElements || 0,
        pageSize: springPageData.size || defaultPageSize,
        current: (springPageData.number || 0) + 1,
      };
    }
    if (!data) data = [];
    if (!paginationProps && paginationProps !== false)
      paginationProps = { total: 0, pageSize: defaultPageSize, current: 1 };


    let filter = null;
    if (enableFilter) {
      const props = this.props.filterFormProps || {};
      if (!props.layout) props.layout = "inline";
      props.onSubmit = this.onFilterFromSubmit.bind(this);

      filter = (
        <div className={styles.tableListForm}>
          <Form {...props}>
            {this.props.createFilter(this.props.form, styles)}
          </Form>
        </div>
      );
    }

    const createButton = enableCreate ? this.props.createButtonComponent : null;

    let multiActions = null;
    if (enableMutliAction && selectedRows.length > 0) {
      multiActions = this.props.createMultiAction(selectedRows);
    }

    let footer = null;
    if (enableFooter && paginationProps !== false) {
      //@ts-ignore
      const { total, pageSize, current } = paginationProps;
      const from = pageSize * (current - 1) + 1;
      const to = pageSize * current;
      footer = () => (
        // 为什么 toFixed, 为了生产模式下能显示出文字
        <span>当前显示第
          <b>{from.toFixed(0)}</b> 至 <b>{to.toFixed(0)}</b> 项，共
          <b>{parseInt(total, 10).toFixed(0)}</b> 项。
        </span>
      );
    }

    return (
      <Card bordered={false} title={title} bodyStyle={bodyStyle} {...(cardProps || {})}>
        {msgType && msg ?
          <Alert type={msgType} message={msg} showIcon style={{ marginBottom: 10 }} />
          : null}

        <div className={styles.tableList}>
          {header}
          {filter}
          {createButton || multiActions
            ? (<div className={styles.tableListOperator}>{createButton}{multiActions}</div>)
            : null}

          <BaseTable
            inCardBody
            enableSelection={enableSelection}
            selectedRows={selectedRows}
            loading={loading}
            rowKey={keyColumn || 'key'}
            data={{ list: data, pagination: paginationProps }}
            expandedRowRender={expandedRowRender}
            columns={columns}
            footer={footer}
            onSelectRow={rows => this.setState({ selectedRows: rows })}
            onChange={this.onTableQueryChange.bind(this)} />
        </div>
      </Card>
    );
  }
}

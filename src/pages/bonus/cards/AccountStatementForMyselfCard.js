import { Form } from '@ant-design/compatible';
// @ts-check
import _ from 'lodash';
import moment from 'moment';
import { connect } from 'umi';
import React from 'react';
import {  message, Card, DatePicker, Statistic } from 'antd';
import ProTable from '@ant-design/pro-table';
import { easyDispatch } from '@/utils/easyDispatch';
import styles from '../style.less';

const { RangePicker } = DatePicker;

// @ts-ignore
@Form.create()
// @ts-ignore
@connect(({ bonus }) => ({ bonus }))

export default class AccountStatementForMyselfCard extends React.PureComponent {
  render() {
    const { accountStatementForMyself } = this.props.bonus

    const columns = [
      {
        title: '序号',
        dataIndex: 'index',
        valueType: 'indexBorder',
        width: 80,
      },
      {
        title: '创建时间',
        key: 'rangePicker',
        dataIndex: 'createTime',
        valueType: 'dateTime',
        renderFormItem: (item, props) =>
          <RangePicker defaultValue={null} onChange={e => props.onChange(e)} />
      },
      {
        title: '金额',
        dataIndex: 'bonusTotal',
        key: 'bonusTotal',
        ellipsis: true,
        valueType: 'money',
        hideInSearch: true,
      },
      {
        title: '类型',
        dataIndex: 'bonusType',
        initialValue: '',
        key: 'bonusType',
        valueEnum: {
          0: { text: '预存款', status: 'Warning' },
          1: { text: '缴纳', status: 'Success', },
          2: { text: '退款', status: 'Error', },
          '': { text: '全部', status: 'Processing', },
        },
      },
      {
        title: '关联赛事日程表名称',
        dataIndex: 'matchScheduleName',
        key: 'matchScheduleName',
        copyable: true,
        ellipsis: true,
        valueType: 'text',
        hideInSearch: true,
        render: (_, row) => row.matchScheduleName ? row.matchScheduleName : '--'
      },
    ];


    return (
      <Card title="当前账户流水信息" bordered={false} style={{ marginBottom: 24 }}>
        <ProTable
          columns={columns} showHeader={false}
          options={{ fullScreen: false, reload: false, setting: false }}
          title={() => {
            if (JSON.stringify(accountStatementForMyself) !== '{}' && accountStatementForMyself) {
              return (
                <ExtraContent bonusTotal={accountStatementForMyself.groupRewardPoolVo && {}} />
              )
            }
          }

          }
          request={
            async (params = {}) => {
              const { current, pageSize, bonusType, rangePicker } = params || {};

              const [beginTimeL, endTimeL] = rangePicker ? [moment(rangePicker[0]).format("x"), moment(rangePicker[1]).format("x")] : [null, null]
              // 如果查不到数据表格赋空值
              let error = false
              // 1.执行 effects 方法获取数据
              await easyDispatch(this, 'bonus/fetchAccountStatementForMyself', {
                pageNum: current, pageSize, bonusType,
                beginTimeL, endTimeL,
                onError: code => {
                  error = true
                  message.error(code.msg || '获取数据失败！')
                },
                onOk: () => { error = false }
              });

              // 2.获取列表数据
              const { accountStatementForMyself } = await this.props.bonus
              return {
                data: error ? null : accountStatementForMyself.pageInfo.list,
                page: params.current,
                success: true,
                total: accountStatementForMyself.total,
              };
            }
          }
          rowKey="id"
          pagination={{ showSizeChanger: true }}
          dateFormatter="string"
        />
      </Card>
    );
  }
}



const ExtraContent = ({ bonusTotal }) => {
  const { nowGroupBonusTotal = '--', prestoreGroupBonusTotal = '--', payGroupBonusTotal = '--', refundGroupBonusTotal = '--' } = bonusTotal
  return <div className={styles.extraContent}>
    <div className={styles.statItem}>
      <Statistic title="当前总金额"
        valueStyle={nowGroupBonusTotal >= 0 ? { color: '#3f8600' } : { color: '#cf1322' }}
        value={nowGroupBonusTotal} />
    </div>
    <div className={styles.statItem}>
      <Statistic title="总预存金额"
        valueStyle={prestoreGroupBonusTotal >= 0 ? { color: '#3f8600' } : { color: '#cf1322' }}
        value={prestoreGroupBonusTotal} />
    </div>
    <div className={styles.statItem}>
      <Statistic title="总缴纳金额"
        valueStyle={payGroupBonusTotal >= 0 ? { color: '#3f8600' } : { color: '#cf1322' }}
        value={payGroupBonusTotal} />
    </div>
    <div className={styles.statItem}>
      <Statistic title="总退款金额"
        valueStyle={refundGroupBonusTotal >= 0 ? { color: '#3f8600' } : { color: '#cf1322' }}
        value={refundGroupBonusTotal} />
    </div>
  </div>
};

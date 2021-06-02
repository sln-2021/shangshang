import { Form } from '@ant-design/compatible';
// @ts-check
import _ from 'lodash';
import moment from 'moment';
import {
  connect
} from 'dva';
import React from 'react';
import {
  
  message,
  Card,
  DatePicker,
  Statistic,
  TreeSelect
} from 'antd';
import ProTable from '@ant-design/pro-table';
import {
  easyDispatch
} from '@/utils/easyDispatch';
import styles from '../style.less';

const {
  RangePicker
} = DatePicker;
const {
  TreeNode
} = TreeSelect;

// @ts-ignore
@Form.create()
// @ts-ignore
@connect(({
  bonus,
  organizer
}) => ({
  bonus,
  organizer
}))
export default class AccountStatementForSubordinateCard extends React.PureComponent {
  componentDidMount() {
    easyDispatch(this, 'organizer/fetchOrganizerTree', {
      onError: () => message.error('获取下拉列表失败'),
    });
  }

  render() {
    const {
      accountStatementForSubordinate
    } = this.props.bonus;
    const {
      organizerTree
    } = this.props.organizer;

    const columns = [{
        title: '序号',
        dataIndex: 'index',
        valueType: 'indexBorder',
        width: 80,
      },
      {
        title: '选取组织',
        key: 'organization',
        dataIndex: 'organization',
        valueType: 'text',
        hideInTable: 'true',
        renderFormItem: (item, props) => ( <
          TreeSelect showSearch style = {
            {
              width: '100%'
            }
          }
          dropdownStyle = {
            {
              maxHeight: 400,
              overflow: 'auto'
            }
          }
          placeholder = "请选择"
          allowClear treeDefaultExpandAll onChange = {
            e => props.onChange(e)
          } >
          {
            organizerTree.map(it => ( <
              TreeNode value = {
                `{"type":${it.type},"ccId":${it.id}}`
              }
              title = {
                it.name
              }
              key = {
                it.id
              } > {
                it.clubNamesTVoList.map(row => ( <
                  TreeNode value = {
                    `{"type":${row.type},"ccId":${row.id}}`
                  }
                  title = {
                    row.name
                  }
                  key = {
                    row.id
                  } >
                  < /TreeNode>
                ))
              } <
              /TreeNode>
            ))
          } <
          /TreeSelect>
        ),
      },
      {
        title: '群体类型',
        dataIndex: 'type',
        initialValue: 'all',
        hideInTable: 'true',
        key: 'type',
        valueEnum: {
          0: {
            text: '协办方',
            status: 'Warning'
          },
          1: {
            text: '渠道',
            status: 'Success'
          },
          2: {
            text: '主办方',
            status: 'Error'
          },
        },
      },
      {
        title: '创建时间',
        key: 'rangePicker',
        dataIndex: 'createTime',
        valueType: 'dateTime',
        renderFormItem: (item, props) => ( <
          RangePicker defaultValue = {
            null
          }
          onChange = {
            e => props.onChange(e)
          }
          />
        ),
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
          0: {
            text: '预存款',
            status: 'Warning'
          },
          1: {
            text: '缴纳',
            status: 'Success'
          },
          2: {
            text: '退款',
            status: 'Error'
          },
          '': {
            text: '全部',
            status: 'Processing'
          },
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
        render: (_, row) => (row.matchScheduleName ? row.matchScheduleName : '--'),
      },
    ];

    return ( <
      Card title = "下线账户流水信息"
      bordered = {
        false
      }
      style = {
        {
          marginBottom: 24
        }
      } >
      <
      ProTable columns = {
        columns
      }
      showHeader = {
        true
      }
      defaultData = {
        []
      }
      title = {
        () => ( <
          ExtraContent bonusTotal = {
            accountStatementForSubordinate.groupRewardPoolVo || {}
          }
          />
        )
      }
      request = {
        async (params = {}) => {
          const {
            current,
            pageSize,
            bonusType,
            rangePicker,
            organization
          } = params || {};
          const {
            type = '', ccId = ''
          } = JSON.parse(organization);
          const [beginTimeL, endTimeL] = rangePicker
            ?
            [moment(rangePicker[0]).format('X'), moment(rangePicker[1]).format('X')] :
            [null, null];
          // 如果查不到数据表格赋空值
          let error = false;
          // 1.执行 effects 方法获取数据
          await easyDispatch(this, 'bonus/fetcAccountStatementForSubordinate', {
            pageNum: current,
            pageSize,
            bonusType,
            beginTimeL,
            endTimeL,
            ccId,
            type,
            onError: code => {
              error = true;
              message.error(code.msg || '获取数据失败！');
            },
            onOk: () => {
              error = false;
            },
          });

          // 2.获取列表数据
          const {
            accountStatementForSubordinate
          } = await this.props.bonus;
          return {
            data: error ? null : accountStatementForSubordinate.pageInfo.list,
            page: params.current,
            success: true,
            total: accountStatementForSubordinate.total,
          };
        }
      }
      rowKey = "id"
      pagination = {
        {
          showSizeChanger: true
        }
      }
      dateFormatter = "string" /
      >
      <
      /Card>
    );
  }
}

const ExtraContent = ({
  bonusTotal
}) => {
  const {
    nowGroupBonusTotal = '--',
      prestoreGroupBonusTotal = '--',
      payGroupBonusTotal = '--',
      refundGroupBonusTotal = '--',
  } = bonusTotal;
  return ( <
    div className = {
      styles.extraContent
    } >
    <
    div className = {
      styles.statItem
    } >
    <
    Statistic title = "当前总金额"
    valueStyle = {
      nowGroupBonusTotal >= 0 ? {
        color: '#3f8600'
      } : {
        color: '#cf1322'
      }
    }
    value = {
      nowGroupBonusTotal
    }
    /> <
    /div> <
    div className = {
      styles.statItem
    } >
    <
    Statistic title = "总预存金额"
    valueStyle = {
      prestoreGroupBonusTotal >= 0 ? {
        color: '#3f8600'
      } : {
        color: '#cf1322'
      }
    }
    value = {
      prestoreGroupBonusTotal
    }
    /> <
    /div> <
    div className = {
      styles.statItem
    } >
    <
    Statistic title = "总缴纳金额"
    valueStyle = {
      payGroupBonusTotal >= 0 ? {
        color: '#3f8600'
      } : {
        color: '#cf1322'
      }
    }
    value = {
      payGroupBonusTotal
    }
    /> <
    /div> <
    div className = {
      styles.statItem
    } >
    <
    Statistic title = "总退款金额"
    valueStyle = {
      refundGroupBonusTotal >= 0 ? {
        color: '#3f8600'
      } : {
        color: '#cf1322'
      }
    }
    value = {
      refundGroupBonusTotal
    }
    /> <
    /div> <
    /div>
  );
};

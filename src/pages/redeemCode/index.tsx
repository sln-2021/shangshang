import React, { Fragment } from 'react';
import _ from 'lodash';
import { connect } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Alert, Icon, message, Popconfirm, Col, Row, Tag } from 'antd';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { easyDispatch } from '@/utils/easyDispatch';
import { getErrorMessage } from '../../common/convertError';
import { color } from '../../common/color';
import ChangeRedeemCode from './modals/ChangeRedeemCode';
import NewRedeemCode from './modals/NewRedeemCode';
import { T } from 'antd/lib/upload/utils';

// 获取 React 元素
const actionRef = React.createRef<ActionType>();

interface ProTableColumns {
  id: string;
  content: string;
  code: any;
}


class RedeemCode extends React.Component {
  state = {
    error: '',
    modalError: '',
  };

  componentDidMount() {
    easyDispatch(this, 'games/fetchReward', {
      onError: () => message.error('获取奖品下拉列表失败'),
    });
  }

  onAddRedeemCode(v: any, callback: Function) {
    this.clearError();
    // @ts-ignore
    const form: any = [];
    v.rewardFormKeys.map((_, i) => form.push(
      {
        type: +v.rewardType.filter(it => it !== undefined)[i],
        itemid: +v.rewardItem.filter(it => it !== undefined)[i],
        num: +v.rewardNumber.filter(it => it !== undefined)[i],
      }
    ))

    easyDispatch(this, 'redeemCode/addRedeemCode', {
      content: JSON.stringify(form),
      code: v.code,
      OnError: code => {
        callback(false); // don't close
        this.onModalError(code);
      },
      onOk: (data) => {
        callback(true);
        message.success('添加成功!');
        // @ts-ignore;
        actionRef.current!.reload();
      },
    });
  }

  onChangeRedeemCode(id: Number, v: any, callback: Function) {
    this.clearError();
    const form: any = [];
    v.rewardFormKeys.map((_, i) => form.push(
      {
        type: +v.rewardType.filter(it => it !== undefined)[i],
        itemid: +v.rewardItem.filter(it => it !== undefined)[i],
        num: +v.rewardNumber.filter(it => it !== undefined)[i],
      }
    ))
    easyDispatch(this, 'redeemCode/changeRedeemCode', {
      content: JSON.stringify(form),
      code: v.code,
      id,
      onError: (code: any) => {
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

  onDeleteRedeemCode(id: number) {
    this.clearError();
    easyDispatch(this, 'redeemCode/deleteRedeemCode', {
      id,
      onError: this.onError.bind(this),
      onOk: () => {
        message.success('删除成功!');
        actionRef!.current!.reload();
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
    const { redeemCode, lodaing, games } = this.props;
    const { reward } = games

    const columns: ProColumns<ProTableColumns>[] = [
      {
        title: '序号',
        dataIndex: 'index',
        valueType: 'indexBorder',
        width: 80,
      },
      {
        title: '兑换码',
        dataIndex: 'code',
        key: 'code',
        copyable: true,
        ellipsis: true,
        valueType: 'text',
        hideInSearch: true,
      },
      {
        title: '内容',
        dataIndex: 'content',
        key: 'content',
        copyable: true,
        ellipsis: true,
        valueType: 'text',
        hideInSearch: true,
        render: (_, row) => {
          const data = JSON.parse(row.content);
          return (
            <>
              {
                data.map(arr => (
                  <div>
                    <span>{reward[arr.type - 1].name}</span>
                =>
                    <span>{reward[arr.type - 1].lcMatchRewards.filter(it => it.itemid == arr.itemid)[0].itemName}</span>
                x
                    <span>{arr.num}</span>
                  </div>
                ))
              }
            </>
          )
        }
      },

      {
        title: '操作',
        valueType: 'option',
        align: 'right',
        render: (text, row) =>
        (
          <Fragment>
            <span style={{ marginLeft: 10 }}>
              <ChangeRedeemCode
                error={modalError}
                data={reward}
                info={JSON.parse(row.content)}
                code={row.code}
                onShowAsync={() => this.clearError()}
                onOk={this.onChangeRedeemCode.bind(this, row.id)}

              />
            </span>
            <span style={{ marginLeft: 10 }}>
              <Popconfirm
                title={
                  <span>
                    确认删除 <b>{row.id}</b> 吗?
                            </span>
                }
                onConfirm={this.onDeleteRedeemCode.bind(this, row.id)}
                okType="danger"
                okText="确认"
                cancelText="取消"
              >
                <span style={{ cursor: 'pointer', color: color.error }}>
                  <Icon type="delete" style={{ marginRight: 4 }} />
                  <span>删除</span>
                </span>
              </Popconfirm>
            </span>
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderWrapper
        content={<div>&nbsp;</div>}
        extraContent={
          <NewRedeemCode
            onShowAsync={() => this.clearError()}
            onOk={this.onAddRedeemCode.bind(this)}
            error={modalError}
            data={reward}
          />
        }
      >
        {error ? (
          <Alert
            message="获取兑换码管理列表失败"
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
                search={false}
                actionRef={actionRef}
                request={async (params = {}) => {
                  const { current, pageSize, content } = params || {};
                  // 1.执行 effects 方法获取数据
                  await easyDispatch(this, 'redeemCode/fetchRedeemCode', {
                    pageNum: current,
                    pageSize,
                    content,
                    onError: this.onError.bind(this),
                  });
                  // 2.获取列表数据
                  const { redeemCode } = await this.props;
                  return {
                    data: redeemCode!.list,
                    page: params.current,
                    success: true,
                    total: redeemCode.total as number,
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
    redeemCode: { redeemCode },
    games,
    loading,
  }: {
    redeemCode: any;
    games: any,
    loading: {
      effects: {
        [key: string]: boolean;
      };
    };
  }) => ({
    redeemCode,
    games,
    loading: loading.effects['redeemCode/fetchRedeemCode'],
  }),
)(RedeemCode);

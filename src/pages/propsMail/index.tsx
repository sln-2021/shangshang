import React, { Fragment } from 'react';
import _ from 'lodash';
import { connect } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Alert, Tag, message, Icon } from 'antd';
import ProTable, { ActionType } from '@ant-design/pro-table';
import { TYPE_ENUM_MAP } from '../../common/convert';
import { easyDispatch, easyRouteTo } from '@/utils/easyDispatch';
import { getErrorMessage } from '../../common/convertError';
import { GameStateType } from '../../models/games';
import { StateType } from '../../models/mail';
import DescriptionList from '../../components/DescriptionList';
import { OrganizerStateType } from '../../models/organizer';
import { color } from '../../common/color';
import NewPropAndMail from './modals/NewPropAndMail';

const { Description } = DescriptionList;
const actionRef = React.createRef<ActionType>();

class Prop extends React.Component {
  state = {
    error: '',
    modalError: '',
  };

  onModalError(response: any) {
    this.setState({ modalError: getErrorMessage(response) });
  }

  clearError() {
    this.setState({ error: '', modalError: '' });
  }

  onSendProp(v: any, callback: Function) {
    this.clearError();

    const attachments: any = [];
    if (v.rewardType) {
      const rewardType = v.rewardType.filter(it => it !== undefined);
      const rewardItem = v.rewardItem.filter(it => it !== undefined);
      const rewardNumber = v.rewardNumber.filter(it => it !== undefined);
      console.log(rewardType, rewardItem, rewardNumber);

      /** 格式化 奖励数组对象 */
      rewardType.map((it: any, i: number) => {
        attachments.push({
          type: parseInt(rewardType[i]),
          itemid: parseInt(rewardItem[i]),
          num: parseInt(rewardNumber[i]),
        });
      });
    }

    let obj: Object = {};
    if (v.key === 2) {
      obj = {
        ..._.pick(v, 'title', 'recipientIds', 'content'),
        type: 2,
        attachments: attachments[0] ? JSON.stringify(attachments) : null,
      };
    } else {
      const { type, id } = JSON.parse(v.recipients);
      const name = type === 0 ? 'recipientClubIds' : 'recipientConferenceIds';
      obj = {
        ..._.pick(v, 'title', 'content'),
        type,
        [name]: id,
        attachments: attachments[0] ? JSON.stringify(attachments) : null,
      };
    }

    // @ts-ignore
    easyDispatch(this, 'mail/addMailAndProp', {
      ...obj,
      onError: code => {
        callback(false); // don't close
        this.onModalError(code);
      },
      onOk: () => {
        callback(true);
        message.success('添加成功!');
        // @ts-ignore;
        actionRef!.current!.reload();
      },
    });
  }

  componentDidMount() {
    easyDispatch(this, 'organizer/fetchOrganizerTree', {
      onError: () => message.error('获取下拉列表失败'),
    });
    easyDispatch(this, 'games/fetchReward', {
      onError: () => message.error('获取奖品下拉列表失败'),
    });
  }

  onError(response: any) {
    this.setState({ error: getErrorMessage(response) });
  }

  render() {
    const { error, modalError } = this.state;
    const { organizerTree, reward } = this.props;

    const columns: [] = [
      {
        title: '序号',
        dataIndex: 'index',
        valueType: 'indexBorder',
      },
      {
        title: '标题',
        dataIndex: 'title',
        key: 'title',
        copyable: true,
        ellipsis: true,
        valueType: 'text',
        hideInSearch: true,
        render: (_, row) => (row.title ? row.title : '--'),
      },

      {
        title: '道具',
        dataIndex: 'propType',
        key: 'id',
        hideInSearch: true,
        render: (_, row) => {
          const props = row.attachments.length > 2 ? JSON.parse(row.attachments) : [];
          return props[0]
            ? props.map(it => (
                <>
                  <Tag key={it.itemid}>
                    {it.name} x{it.num}
                  </Tag>
                  <br />
                </>
              ))
            : '--';
        },
      },
      {
        title: '数量',
        dataIndex: 'propNum',
        key: 'propNum',
        copyable: true,
        ellipsis: true,
        valueType: 'text',
        hideInSearch: true,
        render: (_, row) => (row.propNum ? row.propNum : '--'),
      },
      {
        title: '收件人ID',
        dataIndex: 'recipientIds',
        copyable: true,
        ellipsis: true,
        valueType: 'text',
        hideInSearch: true,
        width: '400',
        render: (_, row) =>
          row.recipientIds
            ? row.recipientIds.split(',').map(it => {
                return <Tag>{it}</Tag>;
              })
            : '--',
      },
      {
        title: '收件人范围',
        dataIndex: 'type',
        key: 'type',
        hideInSearch: true,
        render: (_, row) => (
          <Tag color={TYPE_ENUM_MAP[row.type].color}>{TYPE_ENUM_MAP[row.type].name}</Tag>
        ),
      },
      {
        title: '收件人名称',
        dataIndex: 'recipientName',
        key: 'recipientName',
        copyable: true,
        ellipsis: true,
        valueType: 'text',
        hideInSearch: true,
        render: (_, row) => (row.recipientName ? row.recipientName : '选手集合'),
      },
      {
        title: '操作',
        valueType: 'option',
        dataIndex: 'id',
        align: 'right',
        render: (text, row, _, action) => (
          <Fragment>
            <span style={{ marginRight: 10 }}>
              <span
                style={{ cursor: 'pointer', color: color.link }}
                onClick={() => easyRouteTo(this, `/propsMail-manager/detail/${row.id}`)}
              >
                <Icon type="eye" style={{ marginRight: 2 }} /> 道具领取状态
              </span>
            </span>
          </Fragment>
        ),
      },
    ];

    const header = (
      <Fragment>
        {error ? (
          <Alert
            message="获取道具列表失败"
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
        ) : null}
      </Fragment>
    );

    return (
      <PageHeaderWrapper
        content={<div>此处可以给渠道,协办方下的所有玩家或者多个玩家发送游戏道具或邮件</div>}
        extraContent={
          <NewPropAndMail
            organizerTree={organizerTree}
            reward={reward}
            onShowAsync={() => this.clearError()}
            onOk={this.onSendProp.bind(this)}
            error={modalError}
          />
        }
      >
        {error ? header : null}
        <Card bordered={false} loading={false}>
          <ProTable
            columns={columns}
            actionRef={actionRef}
            search={false}
            expandedRowRender={expandedRowRender}
            request={async (params = {}) => {
              const { current, pageSize } = params || {};
              // 1.执行 effects 方法获取数据
              await easyDispatch(this, 'mail/fetchMailAndProp', {
                pageNum: current,
                pageSize,
                onError: this.onError.bind(this),
              });
              // 2.获取列表数据
              const { mailAndProp } = await this.props;
              return {
                data: mailAndProp!.list,
                page: params.current,
                success: true,
                total: mailAndProp.total as number,
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
    games,
    mail: { mailAndProp },
    organizer: { organizerTree },
    loading,
  }: {
    games: GameStateType;
    mail: StateType;
    organizer: OrganizerStateType;
    reward: any;
    loading: {
      effects: {
        [key: string]: boolean;
      };
    };
  }) => ({
    mailAndProp,
    organizerTree,
    reward: games.reward,
    loading: loading.effects['mail/fetchMailAndProp'],
  }),
)(Prop);

function expandedRowRender(data, index, indent, expanded) {
  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <DescriptionList
        size="large"
        title={<span>邮件正文 :</span>}
        style={{ marginBottom: 32, flex: 2 }}
        layout="horizontal"
        col={1}
      >
        <Description>{data.content}</Description>
      </DescriptionList>
    </div>
  );
}

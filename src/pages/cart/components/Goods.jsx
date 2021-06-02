import { Icon } from '@ant-design/compatible';
import { Form } from '@ant-design/compatible';
/* eslint-disable react/jsx-no-bind */
import React, { Fragment } from 'react';
import _ from 'lodash';
import moment from 'moment';
import { connect } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Popconfirm, message,  Typography, Tag, Divider } from 'antd';
import ProTable, { ActionType, enUSIntl } from '@ant-design/pro-table';
import { getErrorMessage } from '../../../common/convertError';
import { easyDispatch } from '@/utils/easyDispatch';
import { ADVERTISING } from '@/common/convert';
import { color } from '../../../common/color';
import ShopStateType from '../../../models/shop';
import NewGoods from '../modals/NewGoods';
import IDPictures from '../../../components/BaseComponents/IDPictures/index';
import ChangeGoodModal from '../modals/ChangeGoodModal';
const actionRef = React.createRef();
const { Paragraph } = Typography;

class Goods extends React.Component {
  state = {
    error: '',
    modalError: '',
  };
  onModalError(response) {
    this.setState({ modalError: getErrorMessage(response) });
  }

  onError(response) {
    this.setState({ error: getErrorMessage(response) });
  }

  componentDidMount() {
    this.init();
  }

  async init() {
    await easyDispatch(this, 'games/fetchReward', {
      onError: () => message.error('获取奖品下拉列表失败'),
      onOk: () => console.log('成功获取奖励'),
    });

    await easyDispatch(this, 'shop/fetchBillList', {
      type: 2,
      pageNum: 1,
      pageSize: 20,
      onError: this.onError.bind(this),
    });
  }
  clearError() {
    this.setState({ error: '', modalError: '' });
  }

  onAddBillItems(v, callback = null) {
    // 提交表单的组装参数
    const formData = {
      type: 2, // 商品
      worth: v.worth, // 商品价值
      showWeigt: v.showWeigt, // 是否显示（权重控制）
      num: v.num, // 券数量
      amount: v.amount, // 支付金额
      itemName: this.props.reward
        .filter(it => it.id === v.rewardType)[0]
        .lcMatchRewards.filter(it => it.id === v.rewardItem)[0].itemName, // 名称
      itemid: this.props.reward
        .filter(it => it.id === v.rewardType)[0]
        .lcMatchRewards.filter(it => it.id === v.rewardItem)[0].itemid, // 物品ID
      rewardType: v.rewardType, // 分类ID
      // 二进制文件数据
      file: v.file && v.file.fileList[0] ? v.file.fileList[0].originFileObj : null,
    };

    this.clearError();
    // @ts-ignore
    easyDispatch(this, 'shop/addBillItems', {
      ...formData,
      onError: code => {
        callback(false); // don't close
        this.onModalError(code);
      },
      onOk: () => {
        callback(true);
        message.success('添加成功!');
        actionRef.current.reload();
      },
    });
    this.init();
  }

  onChangeBillModal(id, v, callback) {
    this.clearError();
    const currentItem = this.props.reward
      .filter(it => it.id.toString() === v.rewardType)[0]
      .lcMatchRewards.filter(it => it.itemName === v.rewardItem);
    const formData = {
      id,
      type: 2, // 商品
      worth: v.worth, // 商品价值
      showWeigt: v.showWeigt, // 是否显示（权重控制）
      num: v.num, // 券数量
      amount: v.amount, // 支付金额
      itemName: currentItem[0].itemName, // 名称
      itemid: currentItem[0].itemid, // 物品ID
      rewardType: v.rewardType, // 分类ID
      // 二进制文件数据
      file: v.file && v.file.fileList[0] ? v.file.fileList[0].originFileObj : null,
    };
    easyDispatch(this, 'shop/updateBillItems', {
      ...formData,
      onError: code => {
        callback(false); // don't close
        this.onModalError(code);
      },
      onOk: () => {
        callback(true);
        message.success('修改成功!');
        actionRef.current.reload();
      },
    });
    this.init();
  }
  render() {
    const { error, modalError } = this.state;
    const { BillList, games, reward } = this.props;

    const columns = [
      {
        title: '商品ID',
        dataIndex: 'itemid',
        valueType: 'text',
      },
      {
        title: '道具名称',
        dataIndex: 'itemName',
        valueType: 'text',
      },
      {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        copyable: true,
        ellipsis: true,
        valueType: 'text',
        render: (_, row) =>
          row.type === 2 ? <Tag color="#2db7f5">商品</Tag> : <Tag color="#108ee9">话费</Tag>,
      },
      {
        title: '商品价值',
        dataIndex: 'worth',
        key: 'worth',
        copyable: true,
        ellipsis: true,
        valueType: 'text',
      },
      {
        title: '商品图片',
        dataIndex: 'icon',
        valueType: 'text',
        render: (_, row) =>
          row.icon ? <IDPictures files={[{ title: '', url: row.icon }]} /> : '--',
      },
      {
        title: '支付金额',
        dataIndex: 'amount',
        valueType: 'text',
      },
      {
        title: '券数量',
        dataIndex: 'num',
        key: 'num',
        copyable: true,
        ellipsis: true,
        valueType: 'text',
      },
      {
        title: '权重',
        dataIndex: 'showWeigt',
        valueType: 'text',
      },
      {
        title: '操作',
        valueType: 'option',
        render: (text, row) => (
          <Fragment>
            <>
              <span style={{ marginLeft: 10 }}>
                <ChangeGoodModal
                  error={modalError}
                  info={row}
                  onShowAsync={() => this.clearError()}
                  onOk={this.onChangeBillModal.bind(this, row.id)}
                  reward={this.props.reward}
                >
                  <span style={{ cursor: 'pointer', color: color.link }}>
                    <Icon type="tool" style={{ marginRight: 4 }} />
                    <span>修改</span>
                  </span>
                </ChangeGoodModal>
              </span>
              {/* <span style={{ marginLeft: 10 }}>
                                <Popconfirm
                                    title={
                                        <span>
                                            确认删除 <b>{row.title}</b> 吗?
                                        </span>
                                    }
                                    onConfirm={this.onDeleteActivity.bind(this, row.id)}
                                    okType="danger"
                                    okText="确认"
                                    cancelText="取消"
                                >
                                    <span style={{ cursor: 'pointer', color: color.error }}>
                                        <Icon type="delete" style={{ marginRight: 4 }} />
                                        <span>删除</span>
                                    </span>
                                </Popconfirm>
                            </span> */}
            </>
          </Fragment>
        ),
      },
    ];
    return (
      <Fragment>
        <NewGoods
          reward={this.props.reward}
          onShowAsync={() => this.clearError()}
          onOk={this.onAddBillItems.bind(this)}
          error={modalError}
        ></NewGoods>
        {error ? (
          <Alert
            message="获取商品列表失败"
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
          <div style={{ width: '100%', whiteSpace: 'nowrap', overflow: 'scroll' }}>
            <ProTable
              columns={columns}
              actionRef={actionRef}
              request={async (params = {}) => {
                const { current, pageSize, status, rangePicker, name, type } = params || {};
                const [beginTime, endTime] = rangePicker
                  ? [moment(rangePicker[0]).format('x'), moment(rangePicker[1]).format('x')]
                  : [null, null];
                // 1.执行 effects 方法获取数据
                await easyDispatch(this, 'shop/fetchBillList', {
                  pageNum: current,
                  pageSize,
                  type: 2,
                  onError: this.onError.bind(this),
                });
                // 2.获取列表数据
                const { BillList } = await this.props;
                return {
                  data: BillList?.list,
                  page: params.current,
                  success: true,
                  total: BillList.total,
                };
              }}
              rowKey="id"
              pagination={{ showSizeChanger: true }}
              dateFormatter="string"
            ></ProTable>
          </div>
        )}
      </Fragment>
    );
  }
}
export default connect(({ games, shop: { BillList } }) => ({
  games,
  reward: games.reward,
  BillList,
}))(Goods);

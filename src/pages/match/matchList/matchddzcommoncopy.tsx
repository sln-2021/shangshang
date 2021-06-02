/* eslint-disable react/jsx-no-bind */
import React, { PureComponent, Fragment } from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import {
  Card,
  Button,
  message,
  Form,
  Table,
  Input,
  Row,
  Col,
  Select,
} from 'antd';
import ProTable from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { GameStateType } from '../../../models/games';
import { color } from '../../../common/color';
// eslint-disable-next-line import/order
import { easyDispatch } from '@/utils/easyDispatch';
import { getErrorMessage } from '../../../common/convertError';
import DescriptionList from '../../../components/DescriptionList';
import ChangeCommonDDZModal from '../modals/ChangeCommonDDZModal';
import { ToolOutlined } from '@ant-design/icons';
import { fetchLandlordsCommon } from '../../../services/games';
const { Description } = DescriptionList;

const { Option } = Select;
// // 获取 React 元素
type GithubIssueItem = {
  name: string;
  id: number;
  costName: string;
  games: string;
  baseScore: string;
  joinMin: string;
  matchType: string;
  state: string;
};

const actionRef = React.createRef<ActionType>();
type P = {
  games: any;
  reward: any;
};
const matchType = {
  all: { text: '全部', status: 'Default' },
  1: { text: '初级赛', status: 'Warning' },
  2: { text: '中级赛', status: 'Success' },
  3: { text: '高级赛', status: 'Success' },
  4: { text: '大师赛', status: 'Success' },
};

class CommonDDZ extends PureComponent<P> {
  state = {
    error: '',
    modalError: '',
    dataSource: [],
  };

  componentDidMount() {
    this.init();
  }

  onError(response: any) {
    this.setState({ error: response.msg });
  }

  onModalError(response: any) {
    this.setState({ modalError: getErrorMessage(response) });
  }

  onChangeLandlordsCommon(id, v, callback) {
    this.clearError();

    /** 格式化 奖励数组对象 */
    const rewards: any = [
      {
        type: v['rewardType-1'],
        itemid: v['rewardItem-1'],
        num: v['rewardNumber-1'],
      },
      {
        type: v['rewardType-2'],
        itemid: v['rewardItem-2'],
        num: v['rewardNumber-2'],
      },
      {
        type: v['rewardType-3'],
        itemid: v['rewardItem-3'],
        num: v['rewardNumber-3'],
      },
    ];

    easyDispatch(this, 'games/changeLandlordsCommon', {
      id,
      // 普通字符串数据
      ..._.pick(v, 'name', 'games', 'matchType', 'intro', 'baseScore'),
      joinMin: v.join_min,
      joinMax: v.join_max,

      costType: v.applicationFeeType,
      costId: v.applicationFeeItem,
      costN: v.applicationFeeNumber,

      rewards: JSON.stringify(rewards).toString(),
      onError: (code) => {
        callback(false); // don't close
        this.onModalError(code);
      },
      onOk: () => {
        callback(true);
        message.success('修改成功!');
        actionRef!.current!.reload();
      },
    });
  }

  init() {
    easyDispatch(this, 'games/fetchReward', {
      onError: () => message.error('获取奖品下拉列表失败'),
    });
    easyDispatch(this, 'organizer/fetchOrganizerTree', {
      onError: () => message.error('获取下拉列表失败'),
    });
    this.initTableData();
  }
  async initTableData() {
    const param = {
      pageSize: 20,
      pageNum: 1,
      gamename: 'ddztrain',
    };
    const res = await fetchLandlordsCommon(param);
    console.log(res.data.list, 'initdata');
    this.setState({ dataSource: res.data.list });
  }
  clearError() {
    this.setState({ error: '', modalError: '' });
  }
  handleChange = async (value) => {
    const param = {
      pageSize: 20,
      pageNum: 1,
      matchType: value,
      gamename: 'ddztrain',
    };
    const res = await fetchLandlordsCommon(param);
    this.setState({ dataSource: res.data.list });
  };
  onFinish = async (values: any) => {
    console.log('12333333');
    console.log('Success:', values);
    const param = {
      pageSize: 20,
      pageNum: 1,
      name: values.name || '',
      id: values.id || '',
      gamename: 'ddztrain',
    };
    const res = await fetchLandlordsCommon(param);
    this.setState({ dataSource: res.data.list });
  };

  render() {
    console.log('render1');
    const { error, modalError, dataSource } = this.state;
    const { reward } = this.props;
    const columns: ProColumns<GithubIssueItem>[] = [
      {
        title: 'ID',
        dataIndex: 'id',
        valueType: 'text',
      },
      {
        title: '赛事名称',
        dataIndex: 'name',
        key: 'name',
        copyable: true,
        ellipsis: true,
        valueType: 'text',
      },
      {
        title: '报名费',
        dataIndex: 'costName',
        key: 'costName',
        copyable: true,
        ellipsis: true,
        valueType: 'text',
        hideInSearch: true,
        render: (_, row) =>
          row.costName ? `${row.costName} x${row.costN}` : '--',
      },
      {
        title: '对局数',
        dataIndex: 'games',
        key: 'games',
        ellipsis: true,
        valueType: 'text',
        hideInSearch: true,
      },
      {
        title: '底分',
        dataIndex: 'baseScore',
        key: 'baseScore',
        ellipsis: true,
        valueType: 'text',
        hideInSearch: true,
      },
      {
        title: '对局限制（金币）',
        dataIndex: 'joinMin',
        key: 'joinMin',
        ellipsis: true,
        valueType: 'text',
        hideInSearch: true,
        render: (_, row) =>
          row.joinMin ? `${row.joinMin} ～ ${row.joinMax}` : '--',
      },
      {
        title: '类型',
        dataIndex: 'matchType',
        ellipsis: true,
        initialValue: 'all',
        key: 'matchType',
        valueEnum: {
          all: { text: '全部', status: 'Default' },
          1: { text: '初级赛', status: 'Warning' },
          2: { text: '中级赛', status: 'Success' },
          3: { text: '高级赛', status: 'Success' },
          4: { text: '大师赛', status: 'Success' },
        },
      },
      {
        title: '状态',
        dataIndex: 'state',
        ellipsis: true,
        initialValue: 'all',
        key: 'state',
        hideInSearch: true,
        valueEnum: {
          all: { text: '全部', status: 'Default' },
          0: { text: '初始化', status: 'Warning' },
          1: { text: '已发布', status: 'Success' },
        },
      },
      {
        title: '操作',
        valueType: 'option',
        fixed: 'right',
        render: (text, row, _, action) => (
          <Fragment>
            <span>
              <ChangeCommonDDZModal
                error={modalError}
                info={row}
                reward={reward}
                onShowAsync={() => this.clearError()}
                onOk={this.onChangeLandlordsCommon.bind(this, row.id)}
              >
                <span style={{ cursor: 'pointer', color: color.link }}>
                  {/* <Icon type="tool" style={{ marginRight: 4 }} /> */}
                  <ToolOutlined />
                  <span>修改</span>
                </span>
              </ChangeCommonDDZModal>
            </span>
          </Fragment>
        ),
      },
    ];
    return (
      <Fragment>
        <Card bordered={false}>
          <Form onFinish={this.onFinish} layout="inline">
            <Form.Item label="ID" name="id">
              <Input placeholder="请输入ID" />
            </Form.Item>
            <Form.Item label="赛事名称" name="name">
              <Input placeholder="请输入赛事名称" />
            </Form.Item>
            <Form.Item label="类型" style={{ width: '200px' }}>
              <Select defaultValue="" allowClear onChange={this.handleChange}>
                <Option value="">全部</Option>
                <Option value={1}>初级赛</Option>
                <Option value={2}>中极赛</Option>
                <Option value={3}>高级赛</Option>
                <Option value={4}>大师赛</Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            </Form.Item>
          </Form>
          <Table
            columns={columns}
            dataSource={dataSource}
            style={{ marginTop: '50px' }}
          />
        </Card>
      </Fragment>
    );
  }
}

function expandedRowRender(data: any) {
  const rewards = JSON.parse(data.rewards);
  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <DescriptionList
        size="large"
        title={<span>相关的比赛信息 :</span>}
        style={{ marginBottom: 32, flex: 1 }}
        layout="horizontal"
        col={1}
      >
        <Description term="赛事简介">{data.intro}</Description>
      </DescriptionList>

      <DescriptionList
        size="large"
        title={<span>奖励信息 :</span>}
        style={{ marginBottom: 32, flex: 2 }}
        layout="horizontal"
        col={1}
      >
        <Description term="单个最高分奖励">
          {rewards[0].name} x{rewards[0].num}
        </Description>
        <Description term="两个最高分奖励">
          {rewards[1].name} x{rewards[1].num}
        </Description>
        <Description term="三个最高分奖励">
          {rewards[2].name} x{rewards[2].num}
        </Description>
      </DescriptionList>
    </div>
  );
}

export default connect(
  ({
    games,
    loading,
  }: {
    games: GameStateType;
    reward: any;
    loading: {
      effects: {
        [key: string]: boolean;
      };
    };
  }) => ({
    games,
    reward: games.reward,
    loadingFetch: loading.effects['games/fetchLandlordsCommon'],
  }),
)(CommonDDZ);

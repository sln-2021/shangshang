/* eslint-disable react/jsx-no-bind */
import React, { Fragment } from 'react';
import _ from 'lodash';
import moment from 'moment';
import { connect } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Popconfirm, message, Icon, Typography, Tag } from 'antd';
import ProTable, { ActionType } from '@ant-design/pro-table';
import { easyDispatch } from '@/utils/easyDispatch';
import { color } from '../../common/color';
import AvatarIcon from '../../components/AvatarIcon';
import IDPictures from '../../components/BaseComponents/IDPictures/index';
import ErrorHeader from '../../components/ErrorHeader';
import { getErrorMessage } from '../../common/convertError';
import { ActivityStateType } from '../../models/activity';
import { OrganizerStateType } from '../../models/organizer';
import NewActivityImageModal from './modals/NewActivityImageModal';
import NewActivityTextModal from './modals/NewActivityTextModal';
import ChangeActivityModal from './modals/ChangeActivityModal';

const actionRef = React.createRef<ActionType>();
const { Paragraph } = Typography;

type P = {
  organizerTree: any;
  activity: any;
};

type S = {
  error: string;
  modalError: string;
};

class Activity extends React.Component<P, S> {
  state = {
    error: '',
    modalError: '',
  };

  componentDidMount() {
    easyDispatch(this, 'organizer/fetchOrganizerTree', {
      onError: () => message.error('获取下拉列表失败'),
    });
  }

  onDeleteActivity(id: number) {
    this.clearError();
    easyDispatch(this, 'activity/deleteActivity', {
      id,
      onError: this.onError.bind(this),
      onOk: () => {
        message.success('删除成功!');
        actionRef!.current!.reload();
      },
    });
  }

  onChangeActivity(id: number, v: any, callback: Function) {
    this.clearError();
    // @ts-ignore
    easyDispatch(this, 'activity/updateActivity', {
      ..._.pick(v, 'type', 'conference', 'title', 'content', 'orderId'),
      // 二进制文件数据
      iconfile: v!.iconfile && v.iconfile.fileList[0] ? v.iconfile.fileList[0].originFileObj : null,
      imgfile: v!.imgfile && v.imgfile.fileList[0] ? v.imgfile.fileList[0].originFileObj : null,
      begintimeL: moment(v.timeInterval[0]).format('x'),
      endtimeL: moment(v.timeInterval[1]).format('x'),
      id,
      onError: (code: any) => {
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

  onAddActivity(v: any, callback: Function) {
    this.clearError();
    // @ts-ignore
    easyDispatch(this, 'activity/addActivity', {
      ..._.pick(v, 'type', 'conference', 'title', 'content', 'orderId'),
      // 二进制文件数据
      iconfile: v!.iconfile && v.iconfile.fileList[0] ? v.iconfile.fileList[0].originFileObj : null,
      imgfile: v!.imgfile && v.imgfile.fileList[0] ? v.imgfile.fileList[0].originFileObj : null,
      begintimeL: moment(v.timeInterval[0]).format('x'),
      endtimeL: moment(v.timeInterval[1]).format('x'),
      onError: (code: any) => {
        callback(false); // don't close
        this.onModalError(code);
      },
      onOk: () => {
        callback(true);
        message.success('添加成功!');
        actionRef!.current!.reload();
      },
    });
  }

  onModalError(response: any) {
    this.setState({ modalError: getErrorMessage(response) });
  }

  onError(response: any) {
    this.setState({ error: getErrorMessage(response) });
  }

  clearError() {
    this.setState({ error: '', modalError: '' });
  }

  render() {
    const { error, modalError } = this.state;
    const { organizerTree } = this.props;

    const columns: any[] = [
      {
        title: '序号',
        dataIndex: 'index',
        valueType: 'indexBorder',
      },
      {
        title: '排序权重',
        dataIndex: 'orderId',
        valueType: 'text',
      },
      {
        title: 'icon',
        key: 'iconurl',
        dataIndex: 'iconurl',
        hideInSearch: true,
        render: (_: any, row: any) => <AvatarIcon iconURL={row.iconurl} name={row.title} />,
      },
      {
        title: '缩略图',
        dataIndex: 'imgurl',
        key: 'imgurl',
        hideInSearch: true,
        render: (_: any, row: any) =>
          row.imgurl ? <IDPictures files={[{ title: '', url: row.imgurl }]} /> : '--',
      },
      {
        title: '标题',
        dataIndex: 'title',
        key: 'title',
        copyable: true,
        ellipsis: true,
        valueType: 'text',
        hideInSearch: true,
        render: (_: any, row: any) => (row.title ? row.title : '--'),
      },

      // {
      //   title: '内容',
      //   dataIndex: 'content',
      //   key: 'content',
      //   copyable: true,
      //   ellipsis: true,
      //   valueType: 'text',
      //   hideInSearch: true,
      //   render: (_: any, row: any) =>
      //     row.content ? (
      //       <Paragraph
      //         style={{ width: '300px' }}
      //         // ellipsis={{ rows: 2, expandable: true, symbol: 'more' }}
      //         ellipsis={true}
      //       >
      //         {row.content}
      //       </Paragraph>
      //     ) : (
      //         '--'
      //       ),
      // },

      {
        title: '类型',
        dataIndex: 'type',
        initialValue: 'all',
        key: 'type',
        valueEnum: {
          all: { text: '全部', status: 'Default' },
          1: { text: '公告', status: 'Success' },
          2: { text: '活动', status: 'Warning' },
        },
      },
      {
        title: '时间范围',
        dataIndex: 'begintime',
        copyable: true,
        ellipsis: true,
        valueType: 'text',
        hideInSearch: true,
        render: (_: any, row: any) => {
          const { begintime, endtime } = row;
          return (
            <>
              <Tag color="blue">
                {moment(begintime).format('YYYY/MM/DD')}
                  -
                 {moment(endtime).format('YYYY/MM/DD')}
              </Tag>
            </>
          );
        },
      },
      {
        title: '可见渠道',
        dataIndex: 'conName',
        key: 'conName',
        copyable: true,
        ellipsis: true,
        valueType: 'text',
        hideInSearch: true,
        render: (_, row: any) => (row.conName ? row.conName : '全部可见'),
      },
      {
        title: '操作',
        valueType: 'option',
        render: (text: string, row: any) => (
          <Fragment>
            <>
              <span style={{ marginLeft: 10 }}>
                <ChangeActivityModal
                  error={modalError}
                  info={row}
                  organizerTree={organizerTree}
                  onShowAsync={() => this.clearError()}
                  onOk={this.onChangeActivity.bind(this, row.id)}
                >
                  <span style={{ cursor: 'pointer', color: color.link }}>
                    <Icon type="tool" style={{ marginRight: 4 }} />
                    <span>修改</span>
                  </span>
                </ChangeActivityModal>
              </span>
              <span style={{ marginLeft: 10 }}>
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
              </span>
            </>
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderWrapper
        content={<div>此处可以管理活动功能</div>}
        extraContent={
          <>
            <NewActivityTextModal
              organizerTree={organizerTree}
              onShowAsync={() => this.clearError()}
              onOk={this.onAddActivity.bind(this)}
              error={modalError}
            />
            <NewActivityImageModal
              organizerTree={organizerTree}
              onShowAsync={() => this.clearError()}
              onOk={this.onAddActivity.bind(this)}
              error={modalError}
            />
          </>
        }
      >
        {error ? (
          <ErrorHeader
            message="获取活动列表失败"
            error={error}
            clearError={() => this.clearError()}
            reload={actionRef!.current}
          />
        ) : null}
        <Card bordered={false} loading={false}>
          <ProTable
            columns={columns}
            actionRef={actionRef}
            request={async (params = {}) => {
              const { current, pageSize, type = '' } = params || {};
              // 1.执行 effects 方法获取数据
              await easyDispatch(this, 'activity/fetchActivity', {
                pageNum: current,
                pageSize,
                type,
                onError: this.onError.bind(this),
              });
              // 2.获取列表数据
              const { activity } = await this.props;
              return {
                data: activity!.list,
                page: params.current,
                success: true,
                total: activity.total as number,
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
    activity: { activity },
    organizer: { organizerTree },
    loading,
  }: {
    activity: ActivityStateType;
    organizer: OrganizerStateType;
    loading: {
      effects: {
        [key: string]: boolean;
      };
    };
  }) => ({
    activity,
    organizerTree,
    loading: loading.effects['activity/fetchActivity'],
  }),
)(Activity);

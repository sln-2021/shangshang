import { Icon } from '@ant-design/compatible';
import { Form } from '@ant-design/compatible';
/* eslint-disable no-unused-expressions */
/* eslint-disable react/jsx-no-bind */
import React, { Fragment } from 'react';
import _ from 'lodash';
import { connect } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Alert,  message, Popconfirm, Tag, Row, Col, Avatar, Table, Modal } from 'antd';
import ProTable from '@ant-design/pro-table';
// eslint-disable-next-line import/order
import { easyDispatch } from '@/utils/easyDispatch';
import { getErrorMessage } from '../../common/convertError';
import NewBrandType from './modals/NewBrandType';
import NewBrand from './modals/NewBrand';
import ChangeBrandType from './modals/ChangeBrandType';
import { fetchBrand } from '../../services/brand'

const actionRef = React.createRef();


class Reward extends React.Component {
  state = {
    previewVisible: false,
    imageUrl: '',
    error: '',
    modalError: '',
  };

  componentDidMount() {
    this.init();
  }

  onAddRewardType(values, callback) {
    this.clearError();
    // @ts-ignore
    easyDispatch(this, 'brand/addBrandType', {
      ..._.pick(values, 'name'),

      // 二进制文件数据
      file:
        values.file && values.file.fileList[0] ? values.file.fileList[0].originFileObj : null,
      // 广告图
      oneLogo:
        values.oneLogo && values.oneLogo.fileList[0] ? values.oneLogo.fileList[0].originFileObj : null,
      twoLogo:
        values.twoLogo && values.twoLogo.fileList[0] ? values.twoLogo.fileList[0].originFileObj : null,
      threeLogo:
        values.threeLogo && values.threeLogo.fileList[0] ? values.threeLogo.fileList[0].originFileObj : null,
      fourLogo:
        values.fourLogo && values.fourLogo.fileList[0] ? values.fourLogo.fileList[0].originFileObj : null,
      fiveLogo:
        values.fiveLogo && values.fiveLogo.fileList[0] ? values.fiveLogo.fileList[0].originFileObj : null,

      onError: (code) => {
        callback(false); // don't close
        this.onModalError(code);
      },
      onOk: () => {
        callback(true);
        message.success('添加成功!');
        actionRef.current.reload();
      },
    });
  }

  onAddBrand(id, v, callback) {
    this.clearError();
    // @ts-ignore
    easyDispatch(this, 'brand/addBrand', {
      ..._.pick(v, 'name'),
      brandsId: id,
      // 二进制文件数据
      file: v.file && v.file.fileList[0] ? v.file.fileList[0].originFileObj : null,
      onError: (code) => {
        callback(false); // don't close
        this.onModalError(code);
      },
      onOk: () => {
        callback(true);
        message.success('添加成功!');
        actionRef.current.reload();
      },
    });
  }

  // 修改
  onChangeBrandType(id, values, callback) {
    this.clearError();
    // @ts-ignore
    easyDispatch(this, 'brand/changeBrandType', {
      ..._.pick(values, 'name'),
      id,
      // 二进制文件数据
      file:
        values.file && values.file.fileList[0] ? values.file.fileList[0].originFileObj : null,
      // 广告图
      oneLogo:
        values.oneLogo && values.oneLogo.fileList[0] ? values.oneLogo.fileList[0].originFileObj : null,
      twoLogo:
        values.twoLogo && values.twoLogo.fileList[0] ? values.twoLogo.fileList[0].originFileObj : null,
      threeLogo:
        values.threeLogo && values.threeLogo.fileList[0] ? values.threeLogo.fileList[0].originFileObj : null,
      fourLogo:
        values.fourLogo && values.fourLogo.fileList[0] ? values.fourLogo.fileList[0].originFileObj : null,
      fiveLogo:
        values.fiveLogo && values.fiveLogo.fileList[0] ? values.fiveLogo.fileList[0].originFileObj : null,

      onError: (code) => {
        callback(false); // don't close
        this.onModalError(code);
      },
      onOk: () => {
        callback(true);
        message.success('修改成功!');
        actionRef.current.reload();
      },
    });
  }

  // @ts-ignore
  onError(response) {
    this.setState({ error: getErrorMessage(response) });
  }

  onModalError(response) {
    this.setState({ modalError: getErrorMessage(response) });
  }

  init() {
    easyDispatch(this, 'brand/fetchBrandType', {
      onError: this.onError.bind(this),
    });
  }



  clearError() {
    this.setState({ error: '', modalError: '' });
  }

  handleCancel() {
    this.setState({ previewVisible: false });
  }

  render() {
    const { previewVisible, imageUrl, error, modalError } = this.state;
    const { brandType } = this.props;

    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        hideInSearch: true,
      },
      {
        title: 'Icon',
        dataIndex: 'logoUrl',
        render: (_, row) => {
          return (
            <img
              src={row.logoUrl}
              onClick={() => this.setState({ previewVisible: true, imageUrl: row.logoUrl })}
              alt="冠名图"
              style={{ width: '200px', height: '300px' }} />
          )
        },
        hideInSearch: true,
      },
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        valueType: 'text',
        hideInSearch: true,
      },
      {
        title: 'urls',
        dataIndex: 'logoUrls',
        valueType: 'text',
        hideInSearch: true,
      },
      {
        title: '操作',
        valueType: 'option',
        align: 'right',
        render: (text, row, _, action) => (
          <ChangeBrandType
            data={row}
            onShowAsync={() => this.clearError()}
            onOk={this.onChangeBrandType.bind(this, row.id)}
            error={modalError}
          />
        ),
      },
    ];

    return (
      <PageHeaderWrapper
        content={<div>此处可以管理冠名品牌.</div>}
        extraContent={
          <NewBrandType
            onShowAsync={() => this.clearError()}
            onOk={this.onAddRewardType.bind(this)}
            error={modalError}
          />
        }
      >
        {error && (
          <Alert
            message="获取玩家列表失败"
            type="error"
            showIcon
            style={{ marginBottom: 10 }}
            description={
              <span>
                错误信息: {error} <br />
                <a
                  onClick={() => {
                    actionRef.current.reload();
                    this.clearError();
                  }}
                >
                  <b>刷新页面</b>
                </a>
              </span>
            }
          />
        )}
        <Card bordered={false} loading={false}>
          <ProTable
            options={{ fullScreen: false, reload: false, setting: false }}
            columns={columns}
            // dataSource={brandType}
            request={async (params = {}) => {
              const { current, pageSize } = params || {};
              // 1.执行 effects 方法获取数据
              await easyDispatch(this, 'brand/fetchBrandTypeList', {
                pageNum: current,
                pageSize,
                onError: this.onError.bind(this),
              });
              // 2.获取列表数据
              const { brandTypeList } = this.props;
              return {
                data: brandTypeList.list,
                page: params.current,
                success: true,
                total: brandTypeList.total,
              };
            }}

            // expandedRowRender={(record, index, indent, expanded) => {

            //   const columns = [
            //     { title: 'ID', dataIndex: 'id' },
            //     { title: 'Icon', dataIndex: 'logoUrl', render: (text, record, index) => <Avatar src={record.logoUrl} /> },
            //     { title: 'name', dataIndex: 'name' },
            //     {
            //       title: '更新',
            //       dataIndex: 'option',
            //       align: 'right',
            //       render: (text, row, _, action) => (
            //         <Fragment>
            //           <span>
            //             <ChangeBrand
            //               error={modalError}
            //               onShowAsync={() => this.clearError()}
            //               onOk={this.onChangeBrand.bind(this, row.id, row.brandsId)}
            //               data={row}
            //             >
            //               <span style={{ cursor: 'pointer', color: color.link }}>
            //                 <Icon type="update" style={{ marginRight: 4 }} />
            //                 <span>更新</span>
            //               </span>
            //             </ChangeBrand>
            //           </span>
            //         </Fragment>
            //       )
            //     },
            //   ];

            //   return < ProTable
            //     header={null}
            //     size="small"
            //     options={{ fullScreen: false, reload: false, setting: false }}
            //     columns={columns}
            //     request={async () => {
            //       const data = await fetchBrand({ typeId: record.id })
            //       return { data: data.data, success: true };
            //     }}
            //     search={false}
            //     // @ts-ignore
            //     actionRef={actionRef}
            //     rowKey="id"
            //     pagination={{ showSizeChanger: true }}
            //     dateFormatter="string"
            //   />

            // }
            // }
            search={false}
            // @ts-ignore
            actionRef={actionRef}
            rowKey="id"
            pagination={{ showSizeChanger: true }}
            dateFormatter="string"
          />
        </Card>
        <Modal visible={previewVisible} footer={null} onCancel={() => this.handleCancel()}>
          <img alt="example" style={{ width: '100%' }} src={imageUrl} />
        </Modal>
      </PageHeaderWrapper>
    );
  }
}


// @ts-ignore
export default connect(
  ({
    brand: { brandType, brand, brandLevel, brandTypeList },
    loading,
  }) => ({
    brandType,
    brandTypeList,
    brand,
    brandLevel,
    loading: loading.effects['brand/fetchBrandTypeList'],
  }),
)(Reward);

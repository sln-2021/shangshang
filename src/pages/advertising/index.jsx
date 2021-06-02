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
import { easyDispatch } from '@/utils/easyDispatch';
import { ADVERTISING } from '@/common/convert'
import { color } from '../../common/color';
import AvatarIcon from '../../components/AvatarIcon';
import IDPictures from '../../components/BaseComponents/IDPictures/index';
import ErrorHeader from '../../components/ErrorHeader';
import { getErrorMessage } from '../../common/convertError';
import { ActivityStateType } from '../../models/activity';
import { OrganizerStateType } from '../../models/organizer';
import NewAdvertisingModal from './components/NewAdvertisingModal';
import ChangeActivityModal from './components/ChangeActivityModal';
import { queryList, addAdvertising, updateAdvertising, deleteAdvertising, querybrandList } from './service';

const actionRef = React.createRef();
const { Paragraph } = Typography;

class Advertising extends React.Component {
    state = {
        error: '',
        modalError: '',
        brandList: [], // 品牌集合
    };

    componentDidMount() {
        easyDispatch(this, 'organizer/fetchOrganizerTree', {
            onError: () => message.error('获取下拉列表失败'),
        });

        this.querybrandList()
    }



    async onDeleteAdvertising(id) {
        this.clearError();
        const res = await deleteAdvertising({ adId: id })
        console.log(res)
        if (res.status !== 200) {
            message.error('删除失败!');
            actionRef.current.reload();
        } else {
            message.success('删除成功!');
            actionRef.current.reload();
        }
    }

    async onChangeAdvertising(id, v, callback) {
        this.clearError();
        // @ts-ignore
        const res = await updateAdvertising({
            ..._.pick(v, 'name', 'serialNum', 'location', 'conferenceIds', 'allCount', 'brandId'),
            // 二进制文件数据
            file: v.file && v.file.fileList[0] ? v.file.fileList[0].originFileObj : null,
            beginTime: moment(v.timeInterval[0]).format('x'),
            endTime: moment(v.timeInterval[1]).format('x'),
            id,
        })
        console.log(res)
        if (res.status !== 200) {
            callback(false); // don't close
            this.onModalError(res);
        } else {
            callback(true);
            message.success('添加成功!');
            actionRef.current.reload();
        }
    }

    async onAddAdvertising(v, callback) {
        this.clearError();
        // @ts-ignore
        const res = await addAdvertising({
            ..._.pick(v, 'name', 'serialNum', 'location', 'conferenceIds', 'allCount', 'brandId'),
            // 二进制文件数据
            file: v.file && v.file.fileList[0] ? v.file.fileList[0].originFileObj : null,
            beginTime: moment(v.timeInterval[0]).format('x'),
            endTime: moment(v.timeInterval[1]).format('x'),
        })
        console.log(res)
        if (res.status !== 200) {
            callback(false); // don't close
            this.onModalError(res);
        } else {
            callback(true);
            message.success('添加成功!');
            actionRef.current.reload();
        }
    }

    onModalError(response) {
        this.setState({ modalError: getErrorMessage(response) });
    }

    onError(response) {
        this.setState({ error: getErrorMessage(response) });
    }

    async querybrandList() {
        this.clearError();
        const res = await querybrandList()
        console.log(res)
        if (res.status !== 200) {
            message.error('获取品牌下拉列表失败!');
        } else {
            this.setState({ brandList: res.data })
        }
    }

    clearError() {
        this.setState({ error: '', modalError: '' });
    }

    render() {
        const { error, modalError, brandList } = this.state;
        const { organizerTree } = this.props;

        const columns = [
            {
                title: '编号',
                dataIndex: 'id',
                valueType: 'text',
                hideInForm: true,
            },
            {
                title: '序号',
                dataIndex: 'serialNum',
                valueType: 'text',
                hideInForm: true,
            },
            {
                title: '名称',
                dataIndex: 'name',
                valueType: 'text',
                hideInForm: true,
            },
            {
                title: '品牌名称',
                dataIndex: 'brandName',
                valueType: 'text',
                hideInForm: true,
            },
            {
                title: '播放次数',
                dataIndex: 'allCount',
                valueType: 'text',
                hideInForm: true,
            },
            {
                title: '缩略图',
                dataIndex: 'adUrl',
                hideInForm: true,
                render: (_, row) =>
                    row.adUrl ? <IDPictures files={[{ title: '', url: row.adUrl }]} /> : '--',
            },
            {
                title: '位置',
                dataIndex: 'location',
                hideInForm: true,
                render: (_, row) => {
                    const { location } = row;
                    const arr = location ? location.split(',') : []
                    return arr.map(it => <Tag>{ADVERTISING[it]}</Tag>)

                }
                // A登录B普通场C好友场D比赛场
            },
            {
                title: '可见ID',
                dataIndex: 'conferenceIds',
                valueType: 'text',
                hideInForm: true,
            },
            {
                title: '时间',
                dataIndex: 'beginTime',
                hideInSearch: true,
                render: (_, row) => {
                    const { beginTime, endTime } = row;
                    return (
                        <Tag color="blue">
                            {moment(beginTime, 'x').format('YYYY/MM/DD')}-{moment(endTime, 'x').format('YYYY/MM/DD')}
                        </Tag>
                    );
                },
            },
            {
                title: '操作',
                valueType: 'option',
                render: (text, row) => (
                    <Fragment>
                        <span style={{ marginLeft: 10 }}>
                            <ChangeActivityModal
                                error={modalError}
                                info={row}
                                brandList={brandList}
                                organizerTree={organizerTree}
                                onShowAsync={() => this.clearError()}
                                onOk={this.onChangeAdvertising.bind(this, row.id)}
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
                                onConfirm={this.onDeleteAdvertising.bind(this, row.id)}
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
                content={< div > 此处可以管理广告 </div>}
                extraContent={
                    < NewAdvertisingModal
                        organizerTree={organizerTree}
                        onShowAsync={() => this.clearError()}
                        onOk={this.onAddAdvertising.bind(this)}
                        error={modalError}
                        brandList={brandList}
                    />
                }
            >
                {
                    error ? (
                        <ErrorHeader
                            message="获取活动列表失败"
                            error={error}
                            clearError={() => this.clearError()
                            }
                            reload={actionRef.current}
                        />
                    ) : null}
                <Card bordered={false}>
                    <ProTable
                        search={false}
                        columns={columns}
                        actionRef={actionRef}
                        request={async (params, sorter, filter) => {
                            const data = await queryList({ ...params, sorter, filter, pageNum: params.current });
                            return {
                                data: data.data.list,
                                page: params.current,
                                success: true,
                                total: data.data.total,
                            };
                        }}
                        rowKey="id"
                        pagination={{ showSizeChanger: true }}
                        dateFormatter="string"
                    />
                </Card>
            </PageHeaderWrapper >
        );
    }
}

// @ts-ignore
export default connect(
    ({ organizer: { organizerTree } }) => ({ organizerTree }),
)(Advertising);

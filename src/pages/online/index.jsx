import { Form } from '@ant-design/compatible';
import React, { Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, message, Tag } from 'antd';
import { easyDispatch } from '@/utils/easyDispatch';
import { connect } from 'umi';
import request from '@/utils/request';
import { fetchOnlineList, fetchNewList } from '../../services/online';
import ProTable, { ActionType } from '@ant-design/pro-table';
const dictionary = {
    lobby: '全部人数',
    bzmj_friend: '霸州麻将',
    kcmj_friend: '宽城麻将',
    tdh_match: '推倒胡比赛场',
    pqmj_friend: '平泉麻将',
    ddz_friend: '斗地主好友场',
    tdh_normal: '推倒胡普通场',
    tdh_friend: '推倒胡好友场',
    ddz_match: '斗地主比赛场',
    ddz_normal: '斗地主普通场',
};
const actionRef = React.createRef();
const columns = [{
    title: '项目名称',
    dataIndex: 'groupName',
    valueType: 'text',
},
{
    title: '今日新增总人数',
    dataIndex: 'playerNumToday',
    valueType: 'text',
}]
class Online extends React.Component {
    state = {
        error: '',
        modalError: '',
        onlineList: {},
    };
    componentDidMount() {
        this.init();
        this.initNewList();
    }
    clearError() {
        this.setState({ error: '', modalError: '' });
    }

    async init() {
        const data = await fetchOnlineList()
        this.setState({ onlineList: data });
    }
    async initNewList() {
        await easyDispatch(this, 'online/fetchNewList', {
            onError: () => message.error('获取奖品新增人数列表失败'),
            onOk: () => console.log('成功获取新增人数列表'),
        });
    }
    render() {
        const { OnlineList, NewList } = this.props;
        const { error, modalError, onlineList } = this.state;
        return (
            <PageHeaderWrapper
                content={<div> 此处可以查看多端实时在线人数以及不同来源的新增人数的统计.</div>}
            >
                <Card
                    bordered={false}
                    loading={false}
                    style={{
                        padding: '10px',
                    }}
                >
                    {Object.entries(onlineList).map(([key, value]) => {
                        if (key !== 'gate') {
                            return (
                                <div style={{ fontSize: 12, marginBottom: 5 }}>
                                    <Tag>{dictionary?.[key]} : {value}</Tag>
                                </div>
                            );
                        }

                    })}

                    <div style={{ width: '100%', whiteSpace: 'nowrap', overflow: 'scroll' }}>
                        <ProTable
                            search={false}
                            columns={columns}
                            actionRef={actionRef}
                            request={async (params = {}) => {
                                // 1.执行 effects 方法获取数据
                                await easyDispatch(this, 'online/fetchNewList', {
                                    onError: () => message.error('获取新增人数下拉列表失败'),
                                    onOk: () => console.log('成功获取新增人数列表'),
                                });
                                // 2.获取列表数据
                                const { NewList } = await this.props;
                                return {
                                    data: NewList,
                                    page: params.current,
                                    success: true,
                                };
                            }}
                            rowKey="id"
                            pagination={{ showSizeChanger: true }}
                            dateFormatter="string"
                        ></ProTable>
                    </div>
                </Card>
            </PageHeaderWrapper>
        );
    }
}
export default connect(({ online: { OnlineList, NewList } }) => ({
    OnlineList,
    NewList
}))(Online);

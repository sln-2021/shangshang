import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import { connect } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Alert, Tag, message } from 'antd';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { GamesModelType } from '../../models/games';
import { easyDispatch } from '@/utils/easyDispatch';
import { getErrorMessage } from '../../common/convertError';

// 获取 React 元素
const actionRef = React.createRef<ActionType>();

interface ProTableColumns {
    index: number;
    id: number,
    rankinfo: any;
    endtime: string;
}

type P = {
    matchRankinfo: any;
    reward: any;
}

type S = {
    error: string;
    playerId:number | null;
}

class Award extends React.Component<P, S> {
    state = {
        error: '',
        playerId:null
    };

    componentDidMount() {
        easyDispatch(this, 'games/fetchReward', {
            onError: () => message.error('获取奖品下拉列表失败'),
        });
    }

    // @ts-ignore
    onError(response: any) {
        this.setState({ error: getErrorMessage(response) });
    }



    clearError() {
        this.setState({ error: '' });
    }

    render() {
        const { error,playerId } = this.state;
        const rewardName = this.props.reward;
        console.log(rewardName)

        const columns: ProColumns<ProTableColumns>[] = [
            {
                title: '序号',
                dataIndex: 'index',
                valueType: 'indexBorder',
                width: 80,
            },
            {
                title: '玩家ID',
                dataIndex: 'playerId',
                hideInTable: true,
            },
            {
                title: '详情',
                dataIndex: 'rankinfo',
                copyable: true,
                ellipsis: true,
                valueType: 'text',
                hideInSearch:true,
                render: (_, row) => {
                    const data = JSON.parse(row.rankinfo) || [];
                    return data.map(it => {
                        const { reward = [] } = it || []
                        return (
                            <p style={it.id==playerId?{ backgroundColor:'#1890ff',padding:'10px',borderRadius:'10px' }:{}}>
                            <Tag color='magenta'>排名:{it.rank}</Tag>
                            <Tag color='orange'>ID:{it.id}</Tag>
                            <Tag color='green'>昵称:{decodeURI(it.nick)}</Tag>
                            <Tag color='geekblue'>游戏ID:{it.playerid}</Tag>
                            {reward.map(it => <>
                                <Tag color='#87d068'>
                                    {it.name}-
                                    {it.itemName}x
                                    {it.num}
                                </Tag>
                            </>)
                            }
                        </p >
                        )
                    })
                }
            },
            {
                title: '结束时间',
                dataIndex: 'endtime',
                hideInSearch: true,
                render: (_, row) => {
                    return (
                        <Tag color="blue">
                            {moment(row.endtime, 'X').format('YYYY/MM/DD')}
                        </Tag>
                    );
                },
            },
        ];

        return (
            <PageHeaderWrapper content={<div>点开比赛后 显示这个比赛的不同时段的列表.</div>} >
                {error ? (
                    <Alert
                        message="获取同级管理员列表失败"
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
                ) : (
                        <ProTable<ProTableColumns>
                            columns={columns}
                            // @ts-ignore
                            actionRef={actionRef}
                            // search={false}
                            request={async (params = {}) => {
                                const { current, pageSize, username } = params || {};
                                // 1.执行 effects 方法获取数据
                                const id = location.search.split('=')[1]
                                await easyDispatch(this, 'games/fetchMatchRankinfo', {
                                    ...params,
                                    msId: id,
                                    pageNum: current,
                                    pageSize,
                                    username,
                                    onError: this.onError.bind(this),
                                });
                                this.setState({playerId:params.playerId})
                                // 2.获取列表数据
                                const { matchRankinfo } = await this.props;
                                return {
                                    data: matchRankinfo!.list,
                                    page: params.current,
                                    success: true,
                                    total: matchRankinfo.total as number,
                                };
                            }}
                            rowKey="id"
                            pagination={{ showSizeChanger: true }}
                            dateFormatter="string"
                        />
                    )}
            </PageHeaderWrapper>
        );
    }
}

// @ts-ignore
export default connect(
    ({
        games: { matchRankinfo, reward },
        loading,
    }: {
        games: GamesModelType;
        loading: {
            effects: {
                [key: string]: boolean;
            };
        };
    }) => ({
        reward,
        matchRankinfo,
        loading: loading.effects['games/fetchMatchRankinfo'],
    }),
)(Award);

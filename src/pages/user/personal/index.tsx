import React from 'react';
import _ from "lodash";
import { connect } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Alert, message } from 'antd';
import { easyDispatch } from '@/utils/easyDispatch';
import { getErrorMessage } from '../../../common/convertError';
import { UserModelState } from '../../../models/user';
import DetailsBasicInfoCard from "./cards/BasicInfoCard";
import PasswrodInfoCard from "./cards/PasswrodInfoCard";

class Personal extends React.Component {
    state = {
        error: '',
    }

    componentDidMount() { this.query(); }

    // @ts-ignore
    onError(response) { this.setState({ error: getErrorMessage(response) }); }

    // @ts-ignore
    clearError() { this.setState({ error: '' }); }

    query() {
        easyDispatch(this, 'user/fetchUserInfo', {
            onOk: () => console.log('*刷新个人信息成功*'),
            onError: () => console.log('刷新用信息失败')
        });
    }

    onChangeUserInfo(value) {
        this.clearError();

        const { id } = this.props.userInfo;
        easyDispatch(this, 'user/changeUserInfo', {
            id, ...value,
            onError: code => {
                this.onError(code);
            },
            onOk: () => {
                message.success('修改成功!');
                this.loginOut()
            },
        });
    }

    loginOut() {
        easyDispatch(this, 'login/logout', {
            onError: this.onError.bind(this),
        });
    }


    render() {
        const { error } = this.state;
        const { loading, userInfo } = this.props;

        return (
            <PageHeaderWrapper>
                {error ? (<Alert message={error} type="error" showIcon style={{ marginBottom: 10 }} />) : null}
                <DetailsBasicInfoCard
                    loading={loading}
                    details={userInfo}
                />
                <PasswrodInfoCard
                    loading={loading}
                    details={userInfo}
                    onChangeUserInfo={this.onChangeUserInfo.bind(this)}
                />
            </PageHeaderWrapper >
        )

    }
}


export default connect(
    ({
        user: { userInfo },
        login,
        loading,
    }: {
        user: UserModelState;
        loading: {
            effects: {
                [key: string]: boolean;
            };
        };
    }) => ({
        userInfo,
        login,
        loading: loading.effects['user/fetchUserInfo'],
    }),
)(Personal);

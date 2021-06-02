import React from 'react';
import { connect } from 'umi';
import { PageLoading } from '@ant-design/pro-layout';
import { Redirect } from 'umi';
import { stringify } from 'querystring';
import { ConnectState, ConnectProps } from '@/models/connect';
import { UserInfo } from '@/models/user';
import { message } from 'antd';

interface SecurityLayoutProps extends ConnectProps {
  loading?: boolean;
  userInfo?: UserInfo;
}

interface SecurityLayoutState {
  isReady: boolean;
}

class SecurityLayout extends React.Component<SecurityLayoutProps, SecurityLayoutState> {
  state: SecurityLayoutState = {
    isReady: false,
  };

  componentDidMount() {
    this.setState({
      isReady: true,
    });
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'user/fetchUserInfo',
        payload: {
          onOk: () => console.log('*刷新个人信息成功*'),
          onError: () => console.log('刷新用信息失败')
        }

      });
    }
  }

  render() {
    const { isReady } = this.state;
    const { children, loading, userInfo } = this.props;
    // You can replace it to your authentication rule (such as check token exists)
    // 你可以把它替换成你自己的登录认证规则（比如判断 token 是否存在）
    const isLogin = userInfo && userInfo.userType;
    const queryString = stringify({
      redirect: window.location.href,
    });

    if ((!isLogin && loading) || !isReady) {
      return <PageLoading />;
    }
    if (!isLogin) {
      return <Redirect to={`/user/login?${queryString}`}></Redirect>;
    }
    return children;
  }
}

export default connect(({ user, loading }: ConnectState) => ({
  userInfo: user.userInfo,
  loading: loading.models.user,
}))(SecurityLayout);

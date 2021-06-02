import { Avatar, Icon, Menu, Spin } from 'antd';
import  ClickParam  from 'antd/es/menu';
import React from 'react';
import { connect } from 'umi';
import { history as router } from 'umi';
import { ConnectProps, ConnectState } from '@/models/connect';
import { UserInfo } from '@/models/user';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

export interface GlobalHeaderRightProps extends ConnectProps {
  userInfo?: UserInfo;
  menu?: boolean;
}

class AvatarDropdown extends React.Component<GlobalHeaderRightProps> {
  onMenuClick = (event: ClickParam) => {
    const { key } = event;

    if (key === 'logout') {
      const { dispatch } = this.props;

      if (dispatch) {
        dispatch({
          type: 'login/logout',
        });
      }

      return;
    }

    router.push(`/account/${key}`);
  };

  render(): React.ReactNode {
    const {
      userInfo = {
        avatar: '',
        name: '',
      },
      menu,
    } = this.props;
    const menuHeaderDropdown = (
      <Menu
        className={styles.menu}
        selectedKeys={[]}
        onClick={this.onMenuClick}
      >
        {menu && (
          <Menu.Item key="center">
            <Icon type="user" />
            个人中心
          </Menu.Item>
        )}
        {menu && (
          <Menu.Item key="settings">
            <Icon type="setting" />
            个人设置
          </Menu.Item>
        )}
        {menu && <Menu.Divider />}

        <Menu.Item key="logout">
          <Icon type="logout" />
          退出登录
        </Menu.Item>
      </Menu>
    );
    return userInfo && userInfo.username ? (
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar size="small" className={styles.avatar} src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png" alt=" avatar" />
          <span style={{ color: '#40a9ff' }} className={styles.name}>{userInfo.username}</span>
        </span>
      </HeaderDropdown>
    ) : (
        <Spin
          size="small"
          style={{
            marginLeft: 8,
            marginRight: 8,
          }}
        />
      );
  }
}

export default connect(({ user }: ConnectState) => ({
  userInfo: user.userInfo,
}))(AvatarDropdown);

import { DefaultFooter, MenuDataItem, getMenuData, getPageTitle } from '@ant-design/pro-layout';
import { Helmet } from 'react-helmet';
import { Link } from 'umi';
import React from 'react';
import { connect } from 'umi';
// import SelectLang from '@/components/SelectLang';
import { ConnectProps, ConnectState } from '@/models/connect';
import logo from '../assets/logo.svg';
import styles from './UserLayout.less';

export interface UserLayoutProps extends ConnectProps {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
}

const UserLayout: React.FC<UserLayoutProps> = props => {
  const {
    route = {
      routes: [],
    },
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const { breadcrumb } = getMenuData(routes);
  const title = getPageTitle({
    pathname: location.pathname,
    breadcrumb,
    ...props,
  });

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>

      <div className={styles.container}>
        <div className={styles.lang}>
          {/* 多语言选择 暂时用不到 */}
          {/* <SelectLang /> */}
        </div>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>尚尚游戏 管理端</span>
              </Link>
            </div>
            <div className={styles.desc}>介绍 尚尚游戏 详细信息</div>
          </div>
          {children}
        </div>
      </div>
    </>
  );
};

export default connect(({ settings }: ConnectState) => ({ ...settings }))(UserLayout);

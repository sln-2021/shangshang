import React from 'react';
import _ from 'lodash';
import { connect } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Alert, Avatar, Skeleton, Statistic } from 'antd';
import { easyDispatch } from '@/utils/easyDispatch';
import { getErrorMessage } from '../../common/convertError';
import styles from './style.less';
import { CurrentUser, BonusTotal } from './data';
import { StateType } from '../../models/bonus';
import { UserModelState } from '../../models/user';
import AccountStatementForMyselfCard from './cards/AccountStatementForMyselfCard';
import AccountStatementForSubordinateCard from './cards/AccountStatementForSubordinateCard';

const PageHeaderContent: React.FC<{ currentUser: CurrentUser }> = ({ currentUser }) => {
  const loading = currentUser && Object.keys(currentUser).length;
  if (!loading) {
    return <Skeleton avatar paragraph={{ rows: 1 }} active />;
  }
  return (
    <div className={styles.pageHeaderContent}>
      <div className={styles.avatar}>
        <Avatar size="large" src={currentUser.avatar || null}>
          <span style={{ fontSize: '40px', lineHeight: 1.6 }}>{currentUser.username}</span>
        </Avatar>
      </div>
      <div className={styles.content}>
        <div className={styles.contentTitle}>
          您好，
          {currentUser.username}
          ，祝您开心每一天！
        </div>
        <div>
          {/* {currentUser.userType} |{currentUser.userType} */}
          请查看您的流水账单明细！
        </div>
      </div>
    </div>
  );
};

const ExtraContent: React.FC<{ bonusTotal: BonusTotal }> = ({ bonusTotal }) => {
  const { nowGroupBonusTotal = '--', prestoreGroupBonusTotal = '--', payGroupBonusTotal = '--', refundGroupBonusTotal = '--' } = bonusTotal
  return <div className={styles.extraContent}>
    <div className={styles.statItem}>
      <Statistic title="组织当前总金额"
        valueStyle={nowGroupBonusTotal >= 0 ? { color: '#3f8600' } : { color: '#cf1322' }}
        value={nowGroupBonusTotal} />
    </div>
    <div className={styles.statItem}>
      <Statistic title="组织总预存金额"
        valueStyle={prestoreGroupBonusTotal >= 0 ? { color: '#3f8600' } : { color: '#cf1322' }}
        value={prestoreGroupBonusTotal} />
    </div>
    <div className={styles.statItem}>
      <Statistic title="组织总缴纳金额"
        valueStyle={payGroupBonusTotal >= 0 ? { color: '#3f8600' } : { color: '#cf1322' }}
        value={payGroupBonusTotal} />
    </div>
    <div className={styles.statItem}>
      <Statistic title="组织总退款金额"
        valueStyle={refundGroupBonusTotal >= 0 ? { color: '#3f8600' } : { color: '#cf1322' }}
        value={refundGroupBonusTotal} />
    </div>
  </div>
};


class Bill extends React.Component {
  state = {
    error: '',
  };


  componentDidMount() { this.query(); }

  // @ts-ignore
  onError(response) { this.setState({ error: getErrorMessage(response) }) }

  // @ts-ignore
  clearError() { this.setState({ error: '' }) }

  async query() {
    // 获取个人信息
    await easyDispatch(this, 'user/fetchUserInfo', {
      onOk: () => console.log('*刷新个人信息成功*'),
      onError: () => console.log('刷新用信息失败')
    });
    // 获取兑换券池个人统计数据
    await easyDispatch(this, 'bonus/fetchBonusTotal', {
      onError: this.onError.bind(this),
    });
  }

  onPermissions() {
    const { userInfo } = this.props;
    if (userInfo.userType === 'club' || userInfo.userType === 'superClub') return false;
    return true;
  }

  render() {
    const { error } = this.state;
    const { bonusTotal, userInfo } = this.props;

    return (
      <PageHeaderWrapper
        content={<PageHeaderContent currentUser={userInfo} />}
        extraContent={<ExtraContent bonusTotal={bonusTotal || {}} />}
      >
        {error ? (
          <Alert message={error} type="error" showIcon style={{ marginBottom: 10 }} />
        ) : null}
        <AccountStatementForMyselfCard />
        {this.onPermissions() ?
          <AccountStatementForSubordinateCard /> : null
        }
      </PageHeaderWrapper>
    );
  }
}

export default connect(
  ({
    bonus: { bonusTotal },
    user: { userInfo },
  }: {
    bonus: StateType;
    user: UserModelState;
    loading: {
      effects: {
        [key: string]: boolean;
      };
    };
  }) => ({
    bonusTotal,
    userInfo,
  }),
)(Bill);

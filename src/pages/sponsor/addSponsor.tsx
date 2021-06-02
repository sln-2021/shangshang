import _ from 'lodash';
import React, { Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, message, Alert, Steps } from 'antd';
import { easyDispatch } from '@/utils/easyDispatch';
import { connect } from 'umi';
import styles from './style.less';
import FistStepCard from './cards/FistStepCard'
import SecondStepCard from './cards/SecondStepCard'
import ThirdlyStepCard from './cards/ThirdlyStepCard'

const { Step } = Steps;

// @ts-ignore
@connect(({ sponsor, user, loading }) => ({
  sponsor,
  user,
  loadingAddSponsor: loading.effects['sponsor/addSponsor'],
  loadingAddUsers: loading.effects['user/addUsers'],
}))
export default class NewGames extends React.Component {
  state = {
    error: '',
    currentStep: 0,
    step2State: '',
    result: {},
  };

  onError(response) {
    this.setState({ error: response.msg });
  }

  clearError() {
    this.setState({ error: '' });
  }

  // 下一个分步表单
  handleNext() {
    const { currentStep } = this.state;
    this.setState({ currentStep: currentStep + 1 });
  }

  onFistStep(value) {
    this.clearError();
    easyDispatch(this, 'sponsor/addSponsor', {
      ...value,
      onError: code => {
        this.onError(code);
      },
      onOk: code => {
        message.success('获取主办方 ID 成功！');
        this.setState({ step2State: code });
        this.handleNext();
      },
    });
  }

  onSecondStep(value) {
    this.clearError();
    // @ts-ignore
    easyDispatch(this, 'user/addUsers', {
      ..._.pick(value, 'username', 'password', 'bz', 'authFee', 'leagueId'),
      userStatus: 1, // root 用户添加主办方传入1
      onError: code => {
        this.onError(code);
      },
      onOk: code => {
        message.success('添加主办方用户成功！');
        this.setState({
          result: _.pick(value, 'username', 'password', 'bz', 'authFee', 'leagueId'),
        });
        this.handleNext();
      },
    });
  }

  onContinueToAdd() {
    this.setState({ currentStep: 0, result: {} });
  }

  renderContent(currentStep) {
    const { step2State, result } = this.state;
    if (currentStep === 1) {
      return (
        <SecondStepCard
          step2State={step2State}
          loading={this.props.loadingAddUsers}
          onSecondStep={this.onSecondStep.bind(this)}
        />
      );
    }
    if (currentStep === 2) {
      return <ThirdlyStepCard result={result} onContinueToAdd={this.onContinueToAdd.bind(this)} />;
    }
    return (
      <FistStepCard
        loading={this.props.loadingAddSponsor}
        onFistStep={this.onFistStep.bind(this)}
      />
    );
  }

  render() {
    const { error, currentStep } = this.state;
    return (
      <PageHeaderWrapper content={<div>Root 用户可添加主办方</div>}>
        <Card bordered={false} style={{ paddingBottom: 24 }}>
          <Fragment>
            <Steps current={currentStep} className={styles.steps}>
              <Step title="填写主办方信息" />
              <Step title="注册用户" />
              <Step title="完成" />
            </Steps>
            {error ? (
              <Alert
                // message="添加错误"
                type="error"
                showIcon
                style={{ margin: '16px auto', maxWidth: '750px' }}
                description={<span>错误信息: {error} </span>}
              />
            ) : null}
            {this.renderContent(currentStep)}
          </Fragment>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

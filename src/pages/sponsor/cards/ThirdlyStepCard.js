// @ts-check
import _ from 'lodash';
import React, { Fragment } from 'react';
import { Button, Col, Row } from 'antd';
import Result from '@/components/Result';
import { history as router } from 'umi';
import styles from './style.less';

/**
 * @augments {React.PureComponent<{
    result: any;
    onContinueToAdd: () => void;
  }, {}>}
 */

// @ts-ignore
export default class ThirdlyStepCard extends React.PureComponent {
  render() {
    const { result } = this.props;
    const onFinish = () => {
      this.props.onContinueToAdd();
    };
    const information = (
      <div className={styles.information}>
        <Row>
          <Col xs={24} sm={8} className={styles.label}>
            用户名：
          </Col>
          <Col xs={24} sm={16}>
            {result.username || '--'}
          </Col>
        </Row>
        <Row>
          <Col xs={24} sm={8} className={styles.label}>
            密码：
          </Col>
          <Col xs={24} sm={16}>
            {result.password || '--'}
          </Col>
        </Row>
        <Row>
          <Col xs={24} sm={8} className={styles.label}>
            认证金额：
          </Col>
          <Col xs={24} sm={16}>
            <span className={styles.money}>{result.authFee || '--'}</span> 元
          </Col>
        </Row>
      </div>
    );
    const actions = (
      <Fragment>
        <Button type="primary" onClick={onFinish}>
          继续添加主办方
        </Button>
        <Button onClick={() => router.push('/sponsor-manager/list')}>返回主办方列表</Button>
      </Fragment>
    );
    return (
      <Result
        type="success"
        title="操作成功"
        description="现在可以尝试退出当前账户，登录以下账号"
        extra={information}
        actions={actions}
        className={styles.result}
        style={{ marginBottom: 24 }}
      />
    );
  }
}

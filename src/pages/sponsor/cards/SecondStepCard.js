import { Icon } from '@ant-design/compatible';
import { Form } from '@ant-design/compatible';
// @ts-check
import _ from 'lodash';
import React, { Fragment } from 'react';
import {  Button, Input,  InputNumber, Divider } from 'antd';
import styles from './style.less';


/**
 * @augments {React.PureComponent<{
    loading: boolean;
    step2State: string;
    details: any;
    onSecondStep: (values: any) => void;
    form?: any;
  }, {}>}
 */

// @ts-ignore
@Form.create()
export default class SecondStepCard extends React.PureComponent {

  onSecondStep(event) {
    event.preventDefault();
    // @ts-ignore
    this.props.form.validateFields((err, values) => {
      if (err) return;
      this.props.onSecondStep(values);
    });
  }

  render() {
    const simpleRules = (message) => ([{ required: false, message }]);
    const { loading, step2State, form } = this.props;
    const formItemLayout = { labelCol: { span: 5 }, wrapperCol: { span: 19 } };

    return (
      <Fragment>
        <Form layout="horizontal" className={styles.stepForm} hideRequiredMark onSubmit={this.onSecondStep.bind(this)}>
          <Form.Item {...formItemLayout} label="主办方 ID">
            {form.getFieldDecorator('leagueId', {
              initialValue: step2State || null,
              rules: simpleRules('请填入主办方ID！'),
            })(
              <Input
                placeholder="请填入主办方ID"
                disabled
                style={{ width: '100%' }} />
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="用户名">
            {form.getFieldDecorator('username', {
              rules: simpleRules('请填入用户名！'),
            })(
              <Input
                placeholder="请填入用户名"
                style={{ width: '100%' }} />
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="密码">
            {form.getFieldDecorator('password', {
              rules: simpleRules('请填入密码！'),
            })(
              <Input
                placeholder="请填入密码"
                style={{ width: '100%' }} />
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="备注">
            {form.getFieldDecorator('bz', {
              rules: simpleRules('请填入备注！'),
            })(
              <Input
                placeholder="请填入备注"
                style={{ width: '100%' }} />
            )}
          </Form.Item>

          <Form.Item {...formItemLayout} label="缴纳金额">
            {form.getFieldDecorator('authFee', {
              rules: simpleRules('请填入缴纳金额'),
            })(
              <InputNumber
                formatter={value => `${value}元`}
                parser={value => value.replace('元', '')}
                style={{ width: '100%' }}
                placeholder="请填入缴纳金额"
              />
            )}
          </Form.Item>
          <Form.Item
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: {
                span: formItemLayout.wrapperCol.span,
                offset: formItemLayout.labelCol.span,
              },
            }}
            label=""
          >
            <Button loading={loading} type="primary" htmlType="submit">
              下一步
            </Button>
          </Form.Item>
        </Form>
        <Divider style={{ margin: '40px 0 24px' }} />
        <div className={styles.desc}>
          <h3>说明</h3>
          <h4>添加主办方比较特殊必须按步骤进行且不能中途关闭页面或者逆向添加</h4>
          <p>
            第一步先填写主办方信息然后点击下一步会自动获取到主办方 ID 并自动填写到第二步操作当中
          </p>
        </div>
      </Fragment >
    );
  }
}

import { Icon } from '@ant-design/compatible';
import { Form } from '@ant-design/compatible';
// @ts-check
import _ from 'lodash';
import React from 'react';
import {  Button, Row, Col, Input,  Card } from 'antd';


/**
 * @augments {React.PureComponent<{
    loading: boolean;
    details: any;
    onChangBasicInfo: (values: any) => void;

    form?: any;
  }, {}>}
 */

// @ts-ignore
@Form.create()
export default class BankInfoCard extends React.PureComponent {

  onChangBasicInfo(event) {
    event.preventDefault();

    const { details } = this.props;
    const paramOld = _.pick(details, 'bankName', 'bankBranch', 'accountNumber');
    // @ts-ignore
    this.props.form.validateFields((err, values) => {
      if (err) return;
      const param = _.pick(values, 'bankName', 'bankBranch', 'accountNumber');
      // 差异比较 如果参数没变 不执行提交
      if (!_.isEqual(param, paramOld)) {
        this.props.onChangBasicInfo(param);
      }
    });
  }

  render() {
    const simpleRules = (message) => ([{ required: true, message }]);
    const IconFont = Icon.createFromIconfontCN({ scriptUrl: '//at.alicdn.com/t/font_1625968_d6hvs7qs18.js' });
    const { loading, details, form } = this.props;

    return (
      <Form layout="vertical" hideRequiredMark onSubmit={this.onChangBasicInfo.bind(this)}>
        <Card title="银行信息" bordered={false} loading={loading} style={{ marginBottom: 24 }}
          extra={
            <Button icon="save" type="primary" size="small" htmlType="submit">
              保存变更
            </Button>
          }>

          <Row gutter={16} style={{ marginTop: '24px' }}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label="银行名称">
                {form.getFieldDecorator('bankName',
                  {
                    initialValue: details.bankName,
                    rules: simpleRules('请输入银行名称'),
                  })
                  (<Input
                    prefix={<IconFont type="icon-yinxing" />}
                    style={{ width: '100%' }} />)
                }
              </Form.Item>
            </Col>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label="银行账号">
                {form.getFieldDecorator('accountNumber',
                  {
                    initialValue: details.accountNumber,
                    rules: simpleRules('请输入银行账号'),
                  })
                  (<Input
                    prefix={<IconFont type="icon-yinlian1" />}
                    style={{ width: '100%' }} />)
                }
              </Form.Item>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <Form.Item label="开户支行">
                {form.getFieldDecorator('bankBranch',
                  {
                    initialValue: details.bankBranch,
                    rules: simpleRules('请输入开户支行'),
                  })
                  (<Input
                    prefix={<IconFont type="icon-zhihangmingcheng" />}
                    style={{ width: '100%' }} />)
                }
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Form>
    );
  }
}

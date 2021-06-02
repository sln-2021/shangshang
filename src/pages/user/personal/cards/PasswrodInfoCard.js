import { Form } from '@ant-design/compatible';
// @ts-check
import _ from 'lodash';
import React from 'react';
import {  Button, Row, Col, Input, Card } from 'antd';
import { getDateTimeString, ORGANIZER_STATE_MAP } from '../../../../common/convert';

/**
 * @augments {React.PureComponent<{
    loading: boolean;
    details: any;
    onChangeUserInfo: (values: any) => void;

    form?: any;
  }, {}>}
 */

// @ts-ignore
@Form.create()
export default class PasswrodInfoCard extends React.PureComponent {

  onChangeUserInfo(event) {
    event.preventDefault();

    // @ts-ignore
    this.props.form.validateFields((err, values) => {
      if (err) return;
      if (!values) return;
      this.props.onChangeUserInfo(values);
    });
  }

  render() {
    const simpleRules = (message) => ([{ required: true, message }]);
    const { loading, form } = this.props;

    return (
      <Form layout="vertical" hideRequiredMark onSubmit={this.onChangeUserInfo.bind(this)}>
        <Card title="修改密码" bordered={false} loading={loading} style={{ marginBottom: 24 }}
          extra={
            <Button icon="save" type="primary" size="small" htmlType="submit">
              保存变更
            </Button>
          }>
          <Row gutter={16} style={{ marginTop: '24px' }}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label="旧密码">
                {form.getFieldDecorator('oldPassword',
                  {
                    rules: simpleRules('请输入旧密码'),
                  })
                  (<Input style={{ width: '100%' }} />)
                }
              </Form.Item>
            </Col>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label="新密码">
                {form.getFieldDecorator('newPassword',
                  {
                    rules: simpleRules('请输入新密码'),
                  })
                  (<Input style={{ width: '100%' }} />)
                }
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Form>
    );
  }
}

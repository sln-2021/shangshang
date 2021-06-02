import { Form } from '@ant-design/compatible';
/* eslint-disable react/jsx-no-bind */
// @ts-check
import React from 'react';
import {  Button, Row, Col, Input, Card } from 'antd';

/**
 * @augments {React.PureComponent<{
    loading: boolean;
    details: any;
    onChangeNotice: (values: any) => void;

    form?: any;
  }, {}>}
 */
// @ts-ignore
@Form.create()
export default class NoticeInfoCard extends React.PureComponent {

  onChangeNotice(event) {
    event.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) return;
      this.props.onChangeNotice(values);
    });
  }

  render() {
    const simpleRulesForText = (messages) => ([{ required: true, messages, type: "string" }]);
    const { loading, details, form } = this.props;

    return (
      <Form layout="vertical" hideRequiredMark onSubmit={this.onChangeNotice.bind(this)} style={{ marginBottom: 20 }}>
        <Card title="公告设定" bordered={false} loading={loading}
          extra={
            <Button icon="save" type="primary" size="small" htmlType="submit">
              保存变更
            </Button>
          }>
          <Row gutter={16} style={{ marginTop: 24 }}>
            <Col md={16} sm={24}>
              <Form.Item label="公告">
                {form.getFieldDecorator('content',
                  {
                    rules: simpleRulesForText('请输入平台默认公告'),
                    initialValue: details.content || '--',
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

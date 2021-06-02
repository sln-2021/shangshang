import { Form } from '@ant-design/compatible';
// @ts-check
import React from 'react';
import {  Button, Row,  Input, Card } from 'antd';

const InputGroup = Input.Group;
const simpleRulesForText = messages => [{ required: true, messages }];

/**
 * @augments {React.PureComponent<{
    loading: boolean;
    details: any;
    onChange: (values: any) => void;

    form?: any;
  }, {}>}
 */
// @ts-ignore
@Form.create()
export default class SystemAdSettingsCard extends React.PureComponent {
  onChange(event) {
    event.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) return;
      this.props.onChange(values);
    });
  }

  render() {
    const { loading, details, form } = this.props;
    return (
      <Form
        layout="vertical"
        hideRequiredMark
        onSubmit={this.onChange.bind(this)}
        style={{
          marginBottom: 20,
        }}
      >
        <Card
          title="广告观看设定"
          bordered={false}
          loading={loading}
          extra={
            <Button icon="save" type="primary" size="small" htmlType="submit">
              保存变更
            </Button>
          }
        >
          <Row
            gutter={16}
            style={{
              marginTop: 24,
            }}
          >
            <InputGroup compact>
              <Form.Item >
                {form.getFieldDecorator('dayCount', {
                  rules: simpleRulesForText('请输入每天观看次数'),
                  initialValue: String(details.dayCount) || '',
                })(
                  <Input
                    addonBefore="1天看"
                    addonAfter="次"
                    placeholder="请输入每天观看次数"
                    style={{ width: '100%' }}
                  />,
                )}
              </Form.Item>

              <Form.Item >
                {form.getFieldDecorator('gold', {
                  rules: simpleRulesForText('请输入每次观看赠送金币'),
                  initialValue: String(details.gold) || '',
                })(
                  <Input
                    addonBefore="每次领"
                    addonAfter="金币"
                    placeholder="请输入每次观看赠送金币"
                    style={{ width: '100%' }}
                  />
                )}
              </Form.Item>
              <Form.Item>
                <span style={{ marginLeft: '5px', verticalAlign: 'sub'}}>温馨提示：每次观看赠送金币字段使用以数组形式输入</span>
              </Form.Item>
            </InputGroup>
          </Row>
        </Card>
      </Form>
    );
  }
}

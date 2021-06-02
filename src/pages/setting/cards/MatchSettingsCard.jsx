import { Form } from '@ant-design/compatible';
// @ts-check
import React from 'react';
import {  Button, Row, Col, Input, Card } from 'antd';

const { TextArea } = Input;

/**
 * @augments {React.PureComponent<{
    loading: boolean;
    details: any;
    onChangeMatchSettings: (values: any) => void;

    form?: any;
  }, {}>}
 */
// @ts-ignore
@Form.create()
export default class MatchSettingsCard extends React.PureComponent {
  onChangeMatchSettings(event) {
    event.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) return;
      this.props.onChangeMatchSettings(values);
    });
  }

  render() {
    const simpleRulesForText = messages => [
      {
        required: true,
        messages,
        type: 'string',
      },
    ];
    const { loading, details, form } = this.props;

    return (
      <Form
        layout="vertical"
        hideRequiredMark
        onSubmit={this.onChangeMatchSettings.bind(this)}
        style={{
          marginBottom: 20,
        }}
      >
        <Card
          title="比赛设定"
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
            <Col md={4} sm={24}>
              <Form.Item label="比赛券元转换值">
                {form.getFieldDecorator('ticketFee', {
                  rules: [
                    {
                      required: true,
                      messages: '请输入比赛券元转换值！',
                    },
                  ],
                  initialValue: String(details.ticketFee) || '',
                })(
                  <Input
                    addonBefore="1元="
                    addonAfter="钻石"
                    placeholder="请输入比赛券元转换值"
                    style={{
                      width: '100%',
                    }}
                  />,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row
            gutter={16}
            style={{
              marginTop: 24,
            }}
          >
            <Col md={4} sm={24}>
              <Form.Item label="客服微信">
                {form.getFieldDecorator('kefu', {
                  rules: [
                    {
                      required: true,
                      messages: '请填入客服微信',
                    },
                  ],
                  initialValue: details.kefu || '',
                })(
                  <Input
                    placeholder="请填入客服微信"
                    style={{
                      width: '100%',
                    }}
                  />,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col md={16} sm={24}>
              <Form.Item label="斗地主玩法">
                {form.getFieldDecorator('competitionCharter', {
                  rules: simpleRulesForText('请输入玩法！'),
                  initialValue: details.competitionCharter || '',
                })(
                  <TextArea
                    placeholder="请输入玩法"
                    rows={3}
                    style={{
                      width: '100%',
                    }}
                  />,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col md={16} sm={24}>
              <Form.Item label="斗地主赛制说明">
                {form.getFieldDecorator('competitionInstructions', {
                  rules: simpleRulesForText('请输入赛制说明！'),
                  initialValue: details.competitionInstructions || '',
                })(
                  <TextArea
                    placeholder="请输入赛制说明"
                    rows={3}
                    style={{
                      width: '100%',
                    }}
                  />,
                )}
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col md={16} sm={24}>
              <Form.Item label="推倒胡主玩法">
                {form.getFieldDecorator('tdhCompetitionCharter', {
                  rules: simpleRulesForText('请输入玩法！'),
                  initialValue: details.tdhCompetitionCharter || '',
                })(
                  <TextArea
                    placeholder="请输入玩法"
                    rows={3}
                    style={{
                      width: '100%',
                    }}
                  />,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col md={16} sm={24}>
              <Form.Item label="推倒胡赛制说明">
                {form.getFieldDecorator('tdhCompetitionInstructions', {
                  rules: simpleRulesForText('请输入赛制说明！'),
                  initialValue: details.tdhCompetitionInstructions || '',
                })(
                  <TextArea
                    placeholder="请输入赛制说明"
                    rows={3}
                    style={{
                      width: '100%',
                    }}
                  />,
                )}
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Form>
    );
  }
}

import { Icon } from '@ant-design/compatible';
import { Form } from '@ant-design/compatible';
import React, { Fragment } from "react";
import moment from "moment"
import { Row, Col,  Button, InputNumber, Alert, Input, DatePicker } from "antd";
import FormSubmitModal from '../../../components/BaseComponents/FormSubmitModal';

const { TextArea } = Input;
const simpleRules = (message) => ([{ required: true, message }]);
/**
 * @augments {React.PureComponent<{
    onOk: (values: any, callback: Function) => any;
    onShowAsync?: Function
    error: any;
  }, {}>}
 */
export default class NewProvisionalNotice extends React.PureComponent {
  render() {
    const { error, onOk, onShowAsync } = this.props;

    return (
      <FormSubmitModal
        title="添加临时公告"
        formClassName="settingPopupForm"
        onShowAsync={onShowAsync}
        onOk={onOk}
        formProvider={form => (
          <Fragment>
            {error ? (
              <Row gutter={8} style={{ marginBottom: 10 }}>
                <Col span={24}>
                  <Alert type="error" showIcon message="添加出错" description={error} />
                </Col>
              </Row>
            ) : null}

            <Row gutter={8}>
              <Col span={24}>滚动次数</Col>
              <Col span={24}>
                <Form.Item>
                  {form.getFieldDecorator("rollingTimes", {
                    rules: simpleRules('请填入滚动次数!'),
                  })(
                    <InputNumber
                      min={1}
                      max={99999}
                      style={{ width: '100%' }}
                      formatter={value => `${value}次`}
                      parser={value => value.replace('次', '')}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={24}>时间</Col>
              <Col span={24}>
                <Form.Item>
                  {form.getFieldDecorator("dateTimeL", {
                    initialValue: moment(),
                    rules: [{ required: false, }],
                  })(
                    <DatePicker style={{ width: '100%' }} showTime format="YYYY-MM-DD HH:mm" />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={24}>内容</Col>
              <Col span={24}>
                <Form.Item>
                  {form.getFieldDecorator("content", {
                    rules: simpleRules('请填入内容!'),
                  })(
                    <TextArea placeholder="请输入报名说明" rows={6} allowClear />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Fragment>
        )} >
        <Button icon="notification" type="primary">添加临时公告</Button>
      </FormSubmitModal>
    );
  }
}

import { Icon } from '@ant-design/compatible';
import { Form } from '@ant-design/compatible';
import React, { Fragment } from "react";
import { Row, Col,  Button, InputNumber, Alert, Input, Select } from "antd";
import FormSubmitModal from '../../../components/BaseComponents/FormSubmitModal';

const simpleRules = (message) => ([{ required: true, message }]);
/**
 * @augments {React.PureComponent<{
    onOk: (values: any, callback: Function) => any;
    onShowAsync?: Function
    error: any;
  }, {}>}
 */
export default class NewUser extends React.PureComponent {
  render() {
    const { error, onOk, onShowAsync } = this.props;

    return (
      <FormSubmitModal
        title="添加管理员"
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
              <Col span={24}>用户名</Col>
              <Col span={24}>
                <Form.Item>
                  {form.getFieldDecorator("username", {
                    rules: simpleRules('请填入用户名!'),
                  })(
                    <Input placeholder="请填入用户名" />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={24}>密码</Col>
              <Col span={24}>
                <Form.Item>
                  {form.getFieldDecorator("password", {
                    rules: simpleRules('请填入密码!'),
                  })(
                    <Input placeholder="请填入密码" />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={24}>备注</Col>
              <Col span={24}>
                <Form.Item>
                  {form.getFieldDecorator("bz", {
                    rules: [{ required: false, }],
                  })(
                    <Input placeholder="请填入备注" />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={24}>管理员类型</Col>
              <Col span={24}>
                <Form.Item>
                  {form.getFieldDecorator("type", {
                    rules: simpleRules('请选择管理员类型!'),
                  })(
                    <Select style={{ width: '100%' }} placeholder="请选择管理员类型">
                      <Select.Option value='admin'>普通管理员</Select.Option>
                      <Select.Option value='finance'>财务管理员</Select.Option>
                      <Select.Option value='player'>运营管理员</Select.Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Fragment>
        )} >
        <Button icon="user-add" type="primary">添加管理员</Button>
      </FormSubmitModal>
    );
  }
}

import { Icon } from '@ant-design/compatible';
import { Form } from '@ant-design/compatible';
import React, { Fragment } from 'react';
import { Row, Col,  Button, Input, Alert, Select } from 'antd';
import FormSubmitModal from '../../../components/BaseComponents/FormSubmitModal';

const { Option } = Select
const simpleRules = message => [{ required: true, message }];
/**
 * @augments {React.PureComponent<{
    onOk: (values: any, callback: Function) => any;
    onShowAsync?: Function
    error: any;
  }, {}>}
 */
export default class NewRewardType extends React.PureComponent {
  render() {
    const { error, onOk, onShowAsync } = this.props;

    return (
      <FormSubmitModal
        title="添加奖励类型"
        formClassName="settingPopupForm"
        onShowAsync={onShowAsync}
        onOk={onOk}
        formProvider={form => (
          <Fragment>
            {error ? (
              <Row
                gutter={8}
                style={{
                  marginBottom: 10,
                }}
              >
                <Col span={24}>
                  <Alert type="error" showIcon message="添加出错" description={error} />
                </Col>
              </Row>
            ) : null}
            <Row gutter={8}>
              <Col span={24}>类型名称</Col>
              <Col span={24}>
                <Form.Item>
                  {form.getFieldDecorator('name', {
                    rules: simpleRules('请填入奖励类型!'),
                  })(<Input placeholder="请填入奖励类型" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={24}>奖励类型</Col>
              <Col span={24}>
                <Form.Item>
                  {form.getFieldDecorator('cardType', {
                    initialValue: '-1',
                    rules: simpleRules('请选择奖励类型')
                  })(
                    <Select>
                      <Option value="-1">游戏</Option>
                      <Option value="0">实物</Option>
                      <Option value="1">话费</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Fragment>
        )}
      >
        <Button icon="pull-request" type="primary">
          添加奖励类型
        </Button>
      </FormSubmitModal>
    );
  }
}

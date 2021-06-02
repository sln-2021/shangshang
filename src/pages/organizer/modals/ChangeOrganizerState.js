import { Icon } from '@ant-design/compatible';
import { Form } from '@ant-design/compatible';
import React, { Fragment } from 'react';
import { Row, Col,  Alert, Select } from 'antd';
import FormSubmitModal from '../../../components/BaseComponents/FormSubmitModal';

const { Option } = Select;
const simpleRules = message => [{ required: true, message }];
/**
 * @augments {React.PureComponent<{
    onOk: (values: any, callback: Function) => any;
    onShowAsync?: Function;
    error: any;
    info: any;
  }, {}>}
 */
export default class ChangeOrganizerState extends React.PureComponent {
  render() {
    const { error, onOk, onShowAsync, children, info } = this.props;
    return (
      <FormSubmitModal
        title="审核渠道"
        formClassName="settingPopupForm"
        onOk={onOk}
        onShowAsync={onShowAsync}
        formProvider={form => (
          <Fragment>
            {error ? (
              <Alert
                type="error"
                showIcon
                message="操作失败"
                description={error}
                style={{ marginBottom: 10 }}
              />
            ) : null}
            <Row gutter={8}>
              <Col span={24}>缴纳金额</Col>
              <Col span={24}>
                <Form.Item>
                  {form.getFieldDecorator('status', {
                    initialValue: info.status,
                    rules: simpleRules('请选择代理类型'),
                  })(
                    <Select style={{ width: '100%' }}>
                      <Option key={0}>待审核</Option>
                      <Option key={1}>认证通过</Option>
                      <Option key={2}>拒绝</Option>
                      <Option key={3}>审核通过(待缴费)</Option>
                      <Option key={4}>已缴费(待认证)</Option>
                    </Select>,
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Fragment>
        )}
      >
        {children}
      </FormSubmitModal>
    );
  }
}

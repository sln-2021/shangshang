import { Icon } from '@ant-design/compatible';
import { Form } from '@ant-design/compatible';
import React, { Fragment } from 'react';
import { Row, Col,  Alert,  Select, Input } from 'antd';
import FormSubmitModal from '../../../components/BaseComponents/FormSubmitModal';

const { Option } = Select;
const simpleRules = message => [
  {
    required: true,
    message,
  },
];
/**
 * @augments {React.PureComponent<{
    onOk: (values: any, callback: Function) => any;
    onShowAsync?: Function;
    error: any;
    info: any;
    userInfo:any;
  }, {}>}
 */
export default class ChangeMatchDDZStatesModal extends React.PureComponent {
  render() {
    const { error, onOk, onShowAsync, userInfo, children, info } = this.props;

    function Options() {
      const { userType } = userInfo;
      if (userType === 'superAdmin' || userType === 'admin') {
        return (
          <Select
            style={{
              width: '100%',
            }}
          >
            <Option disabled key={0}>
              待渠道审核(审核通过)
            </Option>
            <Option key={1}> 审核通 </Option>
            <Option key={2}> 拒绝 </Option>
          </Select>
        );
      }
      if (userType === 'superOrganizers' || userType === 'organizers') {
        return (
          <Select
            style={{
              width: '100%',
            }}
          >
            <Option disabled key={0}>
              待渠道审核(审核通过)
            </Option>
            <Option disabled key={-1}>
              待渠道审核
            </Option>
            <Option key={1}> 待渠道审核(审核通过) </Option>
            <Option key={2}> 拒绝 </Option>
          </Select>
        );
      }
      return (
        <Select
          style={{
            width: '100%',
          }}
        />
      );
    }

    return (
      <FormSubmitModal
        title="审核比赛"
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
                style={{
                  marginBottom: 10,
                }}
              />
            ) : null}
            <Row gutter={8}>
              <Col span={24}> 比赛状态: </Col>
              <Col span={24}>
                <Form.Item>
                  {form.getFieldDecorator('status', {
                    initialValue: info.status,
                    rules: simpleRules('请选择代理类型'),
                  })(Options())}
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

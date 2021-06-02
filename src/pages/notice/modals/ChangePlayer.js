import { Icon } from '@ant-design/compatible';
import { Form } from '@ant-design/compatible';
import React, { Fragment } from "react";
import { Row, Col,  Alert,  Input } from "antd";
import FormSubmitModal from '../../../components/BaseComponents/FormSubmitModal';

const simpleRules = (message) => ([{ required: true, message }]);
/**
 * @augments {React.PureComponent<{
    onOk: (values: any, callback: Function) => any;
    onShowAsync?: Function;
    onSelect?: Function;
    error: any;
    info: any;
  }, {}>}
 */
export default class ChangePlayer extends React.PureComponent {
  render() {
    const { error, onOk, onShowAsync, onSelect, children, info } = this.props;
    const IconFont = Icon.createFromIconfontCN({ scriptUrl: '//at.alicdn.com/t/font_1625968_d6hvs7qs18.js' });

    return (
      <FormSubmitModal
        title="修改玩家信息"
        formClassName="settingPopupForm"
        onOk={onOk}
        onShowAsync={onShowAsync}
        onSelect={onSelect} // 提交完成后刷新数据
        formProvider={form => (
          <Fragment>
            {error ? (
              <Alert type="error" showIcon message="操作失败" description={error} style={{ marginBottom: 10 }} />
            ) : null}
            <Row gutter={8}>
              <Col span={24}>
                <Form.Item label='银行账号'>
                  {form.getFieldDecorator("bankcardnumber", {
                    initialValue: info.bankcardnumber,
                    rules: simpleRules('请输入银行账号!'),
                  })(<Input
                    prefix={<IconFont type="icon-yinlian1" />}
                    style={{ width: '100%' }} />)}
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={8}>
              <Col span={24}>
                <Form.Item label='开户支行'>
                  {form.getFieldDecorator("bankname", {
                    initialValue: info.bankname,
                    rules: simpleRules('请输入开户支行!'),
                  })(<Input
                    prefix={<IconFont type="icon-zhihangmingcheng" />}
                    style={{ width: '100%' }} />)}
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={8}>
              <Col span={24}>
                <Form.Item label='手机号'>
                  {form.getFieldDecorator("phone", {
                    initialValue: info.phone,
                    rules: simpleRules('请输入手机号!'),
                  })(<Input style={{ width: '100%' }} />)}
                </Form.Item>
              </Col>
            </Row>

          </Fragment>
        )} >
        {children}
      </FormSubmitModal>
    );
  }
}

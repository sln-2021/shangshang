import { Icon } from '@ant-design/compatible';
import { Form } from '@ant-design/compatible';
import React, { Fragment } from 'react';
import { Row, Col,  Button, InputNumber, Alert, Input } from 'antd';
import FormSubmitModal from '../../../components/BaseComponents/FormSubmitModal';

const simpleRules = message => [
  {
    required: true,
    message,
  },
];
/**
 * @augments {React.PureComponent<{
    onOk: (values: any, callback: Function) => any;
    onShowAsync?: Function
    error: any;
  }, {}>}
 */
export default class NewOrganizerUser extends React.PureComponent {
  render() {
    const { error, onOk, onShowAsync } = this.props;

    return (
      <FormSubmitModal
        title="添加渠道"
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
              <Col span={24}> 用户名 </Col>
              <Col span={24}>
                <Form.Item>
                  {form.getFieldDecorator('username', {
                    rules: simpleRules('请填入用户名!'),
                  })(<Input placeholder="请填入用户名" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={24}> 密码 </Col>
              <Col span={24}>
                <Form.Item>
                  {form.getFieldDecorator('password', {
                    rules: simpleRules('请填入密码!'),
                  })(<Input placeholder="请填入密码" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={24}> 备注 </Col>
              <Col span={24}>
                <Form.Item>
                  {form.getFieldDecorator('bz', {
                    rules: [
                      {
                        required: false,
                      },
                    ],
                  })(<Input placeholder="请填入备注" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={24}> 店铺编号 </Col>
              <Col span={24}>
                <Form.Item>
                  {form.getFieldDecorator('storeId', {
                    rules: [
                      {
                        required: false,
                      },
                    ],
                  })(<Input placeholder="请填入店铺编号" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={24}> 渠道ID </Col>
              <Col span={24}>
                <Form.Item>
                  {form.getFieldDecorator('conId', {
                    rules: simpleRules('请输入渠道ID!'),
                  })(<Input type="number" placeholder="请输入渠道ID" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={24}> 店铺网址 </Col>
              <Col span={24}>
                <Form.Item>
                  {form.getFieldDecorator('storeUrl', {
                    rules: simpleRules('请输入店铺网址!'),
                  })(<Input placeholder="请输入店铺网址" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={24}> 缴纳金额 </Col>
              <Col span={24}>
                <Form.Item>
                  {form.getFieldDecorator('authFee', {
                    rules: simpleRules('请填入缴纳金额!'),
                  })(
                    <InputNumber
                      formatter={value => `${value}元`}
                      parser={value => value.replace('元', '')}
                      style={{
                        width: '100%',
                      }}
                      placeholder="请填入缴纳金额"
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Fragment>
        )}
      >
        <Button icon="user-add" type="primary">
          添加渠道
        </Button>
      </FormSubmitModal>
    );
  }
}

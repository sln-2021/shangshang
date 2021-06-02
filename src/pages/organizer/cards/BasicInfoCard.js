import { Form } from '@ant-design/compatible';
// @ts-check
import _ from 'lodash';
import React from 'react';
import {  Button, Row, Col, Input, Card } from 'antd';
import { getDateTimeString, ORGANIZER_STATE_MAP } from '../../../common/convert';

/**
 * @augments {React.PureComponent<{
    loading: boolean;
    details: any;
    onChangBasicInfo: (values: any) => void;

    form?: any;
  }, {}>}
 */

// @ts-ignore
@Form.create()
export default class DetailsBasicInfoCard extends React.PureComponent {
  onChangBasicInfo(event) {
    event.preventDefault();

    const { details } = this.props;
    const paramOld = _.pick(
      details,
      'name',
      'corporateAddress',
      'corporateEmail',
      'corporateName',
      'corporateId',
      'storeUrl'
    );

    // @ts-ignore
    this.props.form.validateFields((err, values) => {
      if (err) return;
      const param = _.pick(
        values,
        'name',
        'corporateAddress',
        'corporateEmail',
        'corporateName',
        'corporateId',
        'storeUrl'
      );
      // 差异比较 如果参数没变 不执行提交
      if (!_.isEqual(param, paramOld)) {
        this.props.onChangBasicInfo(param);
      }
    });
  }

  render() {
    const simpleRules = message => [{ required: true, message }];
    const { loading, details, form } = this.props;

    return (
      <Form layout="vertical" hideRequiredMark onSubmit={this.onChangBasicInfo.bind(this)}>
        <Card
          title="基础信息"
          bordered={false}
          loading={loading}
          style={{ marginBottom: 24 }}
          extra={
            <Button icon="save" type="primary" size="small" htmlType="submit">
              保存变更
            </Button>
          }
        >
          <Row gutter={16} style={{ marginTop: '24px' }}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label="渠道编号">
                <Input style={{ width: '100%' }} value={details.id} disabled />
              </Form.Item>
            </Col>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label="店铺编号">
                <Input style={{ width: '100%' }} value={details.storeId||'--'} disabled />
              </Form.Item>
            </Col>

            <Col lg={6} md={12} sm={24}>
              <Form.Item label="店铺地址">
                {form.getFieldDecorator('storeUrl', {
                  initialValue: details.storeUrl,
                  rules: simpleRules('请输入店铺地址'),
                })(<Input style={{ width: '100%' }} />)}
              </Form.Item>
            </Col>

            <Col lg={6} md={12} sm={24}>
              <Form.Item label="渠道名称">
                {form.getFieldDecorator('name', {
                  initialValue: details.name,
                  rules: simpleRules('请输入渠道名称'),
                })(<Input style={{ width: '100%' }} />)}
              </Form.Item>
            </Col>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label="公司地址">
                {form.getFieldDecorator('corporateAddress', {
                  initialValue: details.corporateAddress,
                  rules: simpleRules('请输入公司地址'),
                })(<Input style={{ width: '100%' }} />)}
              </Form.Item>
            </Col>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label="法人邮箱地址">
                {form.getFieldDecorator('corporateEmail', {
                  initialValue: details.corporateEmail,
                  rules: simpleRules('请输入邮箱地址'),
                })(<Input style={{ width: '100%' }} />)}
              </Form.Item>
            </Col>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label="法人名称">
                {form.getFieldDecorator('corporateName', {
                  initialValue: details.corporateName,
                  rules: simpleRules('请输入法人名称'),
                })(<Input style={{ width: '100%' }} />)}
              </Form.Item>
            </Col>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label="法人证件号">
                {form.getFieldDecorator('corporateId', {
                  initialValue: details.corporateId,
                  rules: simpleRules('请输入法人证件号'),
                })(<Input style={{ width: '100%' }} />)}
              </Form.Item>
            </Col>

            <Col lg={6} md={12} sm={24}>
              <Form.Item label="认证时间">
                <Input
                  style={{ width: '100%' }}
                  value={getDateTimeString(details.authTime)}
                  disabled
                />
              </Form.Item>
            </Col>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label="加盟费">
                <Input style={{ width: '100%' }} value={details.authFee} disabled />
              </Form.Item>
            </Col>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label="关联主办方名称">
                <Input style={{ width: '100%' }} value={details.leagueName} disabled />
              </Form.Item>
            </Col>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label="状态">
                <Input
                  style={{ width: '100%' }}
                  value={
                    details.status
                      ? `${ORGANIZER_STATE_MAP[details.status].name} ${
                          ORGANIZER_STATE_MAP[details.status].icon
                        }`
                      : '--'
                  }
                  disabled
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Form>
    );
  }
}

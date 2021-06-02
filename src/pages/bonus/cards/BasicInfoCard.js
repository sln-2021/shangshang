import { Form } from '@ant-design/compatible';
// @ts-check
import React from 'react';
import {  Button, Row, Col, Input, Card, InputNumber } from 'antd';
import { getDateTimeString, TYPE_ENUM_MAP, VALUE_ENUM_MAP } from '../../../common/convert';

/**
 * @augments {React.PureComponent<{
    loading: boolean;
    details: any;
    onChangeBonus: (values: any) => void;

    form?: any;
  }, {}>}
 */
// @ts-ignore
@Form.create()
export default class DetailsBasicInfoCard extends React.PureComponent {

  onChangeBonus(event) {
    event.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) return;
      this.props.onChangeBonus(values);
    });
  }

  render() {
    const simpleRulesForText = (messages) => ([{ required: false, messages, type: "number" }]);
    const { loading, details, form } = this.props;

    return (
      <Form layout="vertical" hideRequiredMark
        onSubmit={this.onChangeBonus.bind(this)}
      >
        <Card title="基础信息" bordered={false} loading={loading}
        // extra={
        //   <Button icon="save" type="primary" size="small" htmlType="submit">
        //     保存变更
        //   </Button>
        // }
        >
          <Row gutter={16} style={{ marginTop: 24 }}>
            <Col md={16} sm={24}>
              <Col lg={4} md={12} sm={24}>
                <Form.Item label="编号">
                  {form.getFieldDecorator('id',
                    {
                      initialValue: details.id || '--',
                    })
                    (<Input style={{ width: '100%' }} disabled />)
                  }
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="名称">
                  {form.getFieldDecorator('groupName',
                    {
                      initialValue: details.groupName || '--',
                    })
                    (<Input style={{ width: '100%' }} disabled />)
                  }
                </Form.Item>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <Form.Item label="缴纳金额">
                  {form.getFieldDecorator('bonusTotal',
                    {
                      initialValue: details.bonusTotal ? details.bonusTotal : '--',
                      rules: simpleRulesForText('请输入缴纳金额'),
                    })
                    (
                      <InputNumber
                        disabled
                        formatter={value => `${value}元`}
                        parser={value => value.replace('元', '')}
                        style={{ width: '100%' }}
                        placeholder="请填入缴纳金额"
                      />
                    )
                  }
                </Form.Item>
              </Col>

              <Col lg={4} md={12} sm={24}>
                <Form.Item label="类型">
                  {form.getFieldDecorator('type',
                    {
                      initialValue: details.type ? TYPE_ENUM_MAP[details.type].name : '未知',
                    })
                    (<Input style={{ width: '100%' }} disabled />)
                  }
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="状态">
                  {form.getFieldDecorator('status',
                    {
                      initialValue: VALUE_ENUM_MAP[details.status] || '未知',
                    })
                    (<Input style={{ width: '100%' }} disabled />)
                  }
                </Form.Item>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <Form.Item label="创建时间">
                  <Input style={{ width: '100%' }} value={getDateTimeString(details.createTime)} disabled />
                </Form.Item>
              </Col>
            </Col>
            <Col md={8} sm={24}>
              <Card hoverable cover={<img alt="图片加载失败" src={details.flowUrl} />}></Card>
            </Col>
          </Row>
        </Card>
      </Form>
    );
  }
}

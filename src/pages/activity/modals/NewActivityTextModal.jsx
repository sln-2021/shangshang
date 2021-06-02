import { Icon } from '@ant-design/compatible';
import { Form } from '@ant-design/compatible';
import React, { Fragment } from 'react';
import moment from 'moment';
import { Row, Col,  Button, Input, Alert, Select, TreeSelect, DatePicker } from 'antd';
import FormSubmitModal from '../../../components/BaseComponents/FormSubmitModal';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;
const { TreeNode } = TreeSelect;
const simpleRules = msg => [
  {
    required: true,
    message: msg,
  },
];
const ALL_VISIBLE = [{ id: -1, name: '全部渠道', type: 1 }];
/**
 * @augments {React.PureComponent<{
    onOk: (values: any, callback: Function) => any;
    onShowAsync?: Function
    error: any;
    organizerTree: any;
  }, {}>}
 */
export default class NewActivityTextModal extends React.PureComponent {
  render() {
    const { organizerTree, error, onOk, onShowAsync } = this.props;

    return (
      <FormSubmitModal
        title="添加文字活动"
        formClassName="settingPopupForm"
        onShowAsync={onShowAsync}
        onOk={onOk}
        formProvider={form => {
          return (
            <Fragment>
              {error ? (
                <Row
                  gutter={8}
                  style={{
                    marginBottom: 10,
                  }}
                >
                  <Col span={24}>
                    <Alert type="error" showIcon message="发送出错" description={error} />
                  </Col>
                </Row>
              ) : null}
              <Row gutter={8}>
                <Col span={24}> 标题 </Col>
                <Col span={24}>
                  <Form.Item>
                    {form.getFieldDecorator('title', {
                      rules: simpleRules('请输入标题!'),
                    })(
                      <Input
                        style={{
                          width: '100%',
                        }}
                        placeholder="请输入标题"
                      />,
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={8}>
                <Col span={24}>文字内容</Col>
                <Col span={24}>
                  <Form.Item>
                    {form.getFieldDecorator('content', {
                      rules: simpleRules('请输入文字内容!'),
                    })(
                      <TextArea rows={4} style={{ width: '100%' }} placeholder="请输入文字内容" />,
                    )}
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={8}>
                <Col span={24}> 时间范围 </Col>
                <Col span={24}>
                  <Form.Item>
                    {form.getFieldDecorator('timeInterval', {
                      rules: simpleRules('请选择时间范围!'),
                    })(<RangePicker showTime style={{ width: '100%' }} format="YYYY-MM-DD" />)}
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={8}>
                <Col span={24}> 类型 </Col>
                <Col span={24}>
                  <Form.Item>
                    {form.getFieldDecorator('type', {
                      initialValue: 1,
                      rules: simpleRules('请选择类型!'),
                    })(
                      <Select style={{ width: '100%' }} placeholder="请选择类型">
                        <Option value={1}>公告</Option>
                        <Option value={2}>活动</Option>
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={8}>
                <Col span={24}> 排序权重 </Col>
                <Col span={24}>
                  <Form.Item help="数字越大排序越靠前">
                    {form.getFieldDecorator('orderId', {
                      rules: simpleRules('请输入排序权重!'),
                    })(
                      <Input
                        style={{
                          width: '100%',
                        }}
                        placeholder="请输入排序权重"
                        type="number"
                      />,
                    )}
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={8}>
                <Col span={24}> 可见范围 </Col>
                <Col span={24}>
                  <Form.Item>
                    {form.getFieldDecorator('conference', {
                      initialValue: -1,
                      rules: simpleRules('请选择可见范围!'),
                    })(
                      <TreeSelect
                        style={{
                          width: '100%',
                        }}
                        dropdownStyle={{
                          maxHeight: 400,
                          overflow: 'auto',
                        }}
                        placeholder="请选择可见范围"
                        allowClear
                      >
                        {ALL_VISIBLE.concat(organizerTree).map(it => (
                          <TreeNode value={it.id} title={it.name} key={it.id} />
                        ))}
                      </TreeSelect>,
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Fragment>
          );
        }}
      >
        <Button icon="rocket" type="primary">
          添加文字活动
        </Button>
      </FormSubmitModal>
    );
  }
}

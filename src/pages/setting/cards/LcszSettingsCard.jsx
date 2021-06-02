import { Icon } from '@ant-design/compatible';
import { Form } from '@ant-design/compatible';
// @ts-check
import React from 'react';
import {
   Button, Row, Col, Input, Card, InputNumber, Select,  message
} from 'antd';
import { connect } from 'umi';
import { easyDispatch, easyRouteTo } from '@/utils/easyDispatch';

const InputGroup = Input.Group;
const { TextArea } = Input;
const { Option } = Select;
const simpleRules = (msg) => [{ required: true, message: msg }];

/**
 * @augments {React.PureComponent<{
    reward : any;
    onChange: (values,type) => void;
    form?:any;
  }, {}>}
 */
// @ts-ignore




class LcszSettingsCard extends React.PureComponent {

  componentDidMount() {
    this.init();
  }



  onChange(event) {
    event.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) return;
      this.props.onChange(values, '绑定');
    });
  }



  init() {
    const { form } = this.props
    // 获取绑定手机和下载登录奖励设置
    easyDispatch(this, 'setting/fetchLcsz', {
      onError: () => message.error('查询获取绑定手机和下载登录奖励设置失败'),
      onOk: (details) => {

        form.setFieldsValue({
          title: details[0].title,

          content: details[0].content,

          bindFormKeys: details[0].rewardjson
            ? JSON.parse(details[0].rewardjson).map((it, index) => index)
            : [],


          bindRewardType: details[0].rewardjson
            ? JSON.parse(details[0].rewardjson).map(
              it => `${it.type}*${it.cardType}*${it.name}`,
            )
            : [],
          bindRewardItem: details[0].rewardjson
            ? JSON.parse(details[0].rewardjson).map(
              it => `${it.itemName}*${it.itemid}*${it.itemInfo}`,
            )
            : [],
          bindRewardNumber: details
            ? JSON.parse(details[0].rewardjson).map(it => it.num)
            : [],
        });
      },
    });
  }



  addDynamicForm(formKey) {
    const { form } = this.props;
    const value = form.getFieldValue(formKey);
    const nextKeys = value.concat(value.length);
    if (nextKeys.length <= 3) {
      form.setFieldsValue({ [formKey]: nextKeys });
    }

  }

  removeDynamicForm(k, formKey) {
    const { form } = this.props;
    const value = form.getFieldValue(formKey);
    if (value.length === 1) return;
    form.setFieldsValue({
      [formKey]: value.filter((key) => key !== value.length - 1),
    });
  }

  render() {
    const { loading, setting, form, reward } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const details = setting.lcsz





    /**
    * 动态添加绑定奖励奖励组件
    */
    getFieldDecorator('bindFormKeys', {
      initialValue: details[0]
        ? JSON.parse(details[0].rewardjson).map((it, index) => index)
        : [],
    });
    const bindFormKeys = getFieldValue('bindFormKeys');
    const bindItems = bindFormKeys.map((k) => (
      <Form.Item required={false} key={k} style={{ marginBottom: 0 }}>
        <InputGroup style={{ width: '94%' }} compact>

          <Form.Item style={{ width: '30%', textAlign: 'center' }}>
            {getFieldDecorator(`bindRewardType[${k}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              rules: simpleRules('请选择奖励类型!'),
            })(
              <Select style={{ width: '100%' }} placeholder="请选择奖励类型">
                {reward
                  ? reward.map((it) => {
                    const value = `${it.id}*${it.cardType}*${it.name}`;
                    return <Option value={value}>{it.name}</Option>;
                  })
                  : null}
              </Select>,
            )}
          </Form.Item>
          <Form.Item style={{ width: '30%', textAlign: 'center' }}>
            {getFieldDecorator(`bindRewardItem[${k}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              rules: simpleRules('请选择奖励物品!'),
            })(
              <Select style={{ width: '100%' }} placeholder="请选择奖励物品">
                {getFieldValue(`bindRewardType[${k}]`)
                  ? reward[getFieldValue(`bindRewardType[${k}]`).split('*')[0] - 1].lcMatchRewards.map(
                    it => {
                      const value = `${it.itemName}*${it.itemid}*${it.itemInfo}`;
                      return <Option value={value}>{it.itemName}</Option>;
                    },
                  )
                  : null}
              </Select>,
            )}
          </Form.Item>
          <Form.Item style={{ width: '40%', textAlign: 'center' }}>
            {getFieldDecorator(`bindRewardNumber[${k}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              rules: simpleRules('请输入奖励数量!'),
            })(<InputNumber style={{ width: '100%' }} placeholder="数量" />)}
          </Form.Item>
        </InputGroup>
        {bindFormKeys.length > 1 ? (
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            onClick={this.removeDynamicForm.bind(this, k, 'bindFormKeys')}
            style={{ position: 'absolute', top: '-9px', marginLeft: '4px' }}
          />
        ) : null}
      </Form.Item>
    ));



    return (
      <Form
        layout="vertical"
        hideRequiredMark
        onSubmit={this.onChange.bind(this)}
        style={{
          marginBottom: 20,
        }}
      >
        <Card
          title="绑定奖励设定"
          bordered={false}
          loading={loading}
          extra={
            <Button icon="save" type="primary" size="small" htmlType="submit">
              保存变更
            </Button>
          }
        >

          <Row gutter={16} style={{ marginTop: '24px' }}>
            <Col span={5}>
              <Row>
                <Form.Item >
                  {form.getFieldDecorator('title', {
                    rules: simpleRules('请输入标题!'),
                  })(
                    <Input
                      placeholder="请输入标题"
                      style={{ width: '100%' }}
                    />
                  )}
                </Form.Item>
              </Row>
              <Row>
                <Form.Item >
                  {form.getFieldDecorator('content', {
                    rules: simpleRules('请输入内容!'),
                  })(
                    <TextArea
                      placeholder="请输入内容"
                      style={{ width: '100%' }}
                      rows={4}
                    />
                  )}
                </Form.Item>
              </Row>
            </Col>
            <Col span={19}>
              {bindItems}
              <Form.Item
                extra={<p style={{ padding: 0, margin: 0 }}>最多可以添加3个</p>}
              >
                {
                  bindFormKeys.length >= 3 ? null : <Button
                    type="dashed"
                    onClick={this.addDynamicForm.bind(this, 'bindFormKeys')}
                    style={{ width: '100%' }}
                  >
                    <Icon type="plus" /> 添加奖励
                  </Button>
                }

              </Form.Item>
            </Col>
          </Row>

        </Card>
      </Form>
    );
  }
}


export default connect(
  ({ setting, loading }) => ({
    setting,
    loading: loading.effects['setting/fetchLcsz'],
  }),
)(Form.create()(LcszSettingsCard));



// 0:
//    id: 1
//    rewardjson: "[{"type":1,"cardType":-1,"name":"","itemName":"","itemid":1,"itemInfo":"","num":1},{"type":1,"cardType":-1,"name":"","itemName":"","itemid":1,"itemInfo":"","num":1}]"
//    tasktype: 6
//    title: "绑定"
// 1:
//    id: 2
//    rewardjson: "[{"type":1,"cardType":-1,"name":"","itemName":"","itemid":1,"itemInfo":"","num":1},{"type":1,"cardType":-1,"name":"","itemName":"","itemid":1,"itemInfo":"","num":1}]"
//    tasktype: 7
//    title: "下载"

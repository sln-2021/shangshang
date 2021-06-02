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




class DownloadSettingsCard extends React.PureComponent {

  componentDidMount() {
    this.init();
  }



  onChange(event) {
    event.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) return;
      this.props.onChange(values, '下载');
    });
  }



  init() {
    const { form } = this.props
    // 获取绑定手机和下载登录奖励设置
    easyDispatch(this, 'setting/fetchLcsz', {
      onError: () => message.error('查询获取绑定手机和下载登录奖励设置失败'),
      onOk: (details) => {

        form.setFieldsValue({
          title: details[1].title,

          content: details[1].content,

          downloadFormKeys: details[1].rewardjson
            ? JSON.parse(details[1].rewardjson).map((it, index) => index)
            : [],


          downloadRewardType: details[1].rewardjson
            ? JSON.parse(details[1].rewardjson).map(
              it => `${it.type}*${it.cardType}*${it.name}`,
            )
            : [],
          downloadRewardItem: details[1].rewardjson
            ? JSON.parse(details[1].rewardjson).map(
              it => `${it.itemName}*${it.itemid}*${it.itemInfo}`,
            )
            : [],
          downloadRewardNumber: details
            ? JSON.parse(details[1].rewardjson).map(it => it.num)
            : [],
        });
      },
    });
  }



  addDynamicForm(formKey) {
    const { form } = this.props;
    const value = form.getFieldValue(formKey);
    const nextKeys = value.concat(value.length);
    console.log(nextKeys.length > 3)
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

    console.log(details[1])




    /**
      * 动态添加下载奖励奖励组件
      */
    getFieldDecorator('downloadFormKeys', {
      initialValue: details[0]
        ? JSON.parse(details[0].rewardjson).map((it, index) => index)
        : [],
    });
    const downloadFormKeys = getFieldValue('downloadFormKeys');
    const downloadItems = downloadFormKeys.map((k) => (
      <Form.Item required={false} key={k} style={{ marginBottom: 0 }}>
        <InputGroup style={{ width: '94%' }} compact>

          <Form.Item style={{ width: '30%', textAlign: 'center' }}>
            {getFieldDecorator(`downloadRewardType[${k}]`, {
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
            {getFieldDecorator(`downloadRewardItem[${k}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              rules: simpleRules('请选择奖励物品!'),
            })(
              <Select style={{ width: '100%' }} placeholder="请选择奖励物品">
                {getFieldValue(`downloadRewardType[${k}]`)
                  ? reward[getFieldValue(`downloadRewardType[${k}]`).split('*')[0] - 1].lcMatchRewards.map(
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
            {getFieldDecorator(`downloadRewardNumber[${k}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              rules: simpleRules('请输入奖励数量!'),
            })(<InputNumber style={{ width: '100%' }} placeholder="数量" />)}
          </Form.Item>
        </InputGroup>
        {downloadFormKeys.length > 1 ? (
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            onClick={this.removeDynamicForm.bind(this, k, 'downloadFormKeys')}
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
          title="下载奖励设定"
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
              {downloadItems}
              <Form.Item
                extra={<p style={{ padding: 0, margin: 0 }}>最多可以添加3个</p>}
              >
                {
                  downloadFormKeys.length >= 3 ? null : <Button
                    type="dashed"
                    onClick={this.addDynamicForm.bind(this, 'downloadFormKeys')}
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
)(Form.create()(DownloadSettingsCard));




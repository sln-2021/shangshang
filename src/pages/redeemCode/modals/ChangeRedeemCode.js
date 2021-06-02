import { Icon } from '@ant-design/compatible';
import { Form } from '@ant-design/compatible';
import React from "react";
import { Row, Col,  Button, InputNumber, Alert, Input, Select,  Modal } from "antd";
import { color } from '../../../common/color';

const { Option } = Select;
const InputGroup = Input.Group;
const simpleRules = (message) => ([{ required: true, message }]);
/**
 * @augments {React.PureComponent<{
    onOk: (values: any, callback: Function) => any;
    onShowAsync?: Function
    data:any;
    info: any;
    code:any;
    error: any;
  }, {}>}
 */
@Form.create()
export default class ChangeRedeemCode extends React.Component {
  state = {
    visible: false,
    loading: false,
  };

  showModal = () => {
    const { form } = this.props;
    this.setState({
      visible: true,
    });
    form.resetFields();
  };

  handleOk = () => {
    const { onOk } = this.props;
    const callback = (close = true) => {
      this.setState({ loading: false });
      if (close) setTimeout(this.setState({ visible: false }), 15);
    };
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ loading: true });
        onOk(values, callback);
      }
    });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };


  addDynamicForm = (formKey) => {
    const { form } = this.props;
    const value = form.getFieldValue(formKey);
    const nextKeys = value.concat(value.length);
    form.setFieldsValue({ [formKey]: nextKeys });
  }

  removeDynamicForm = (k, formKey) => {
    const { form } = this.props;
    const value = form.getFieldValue(formKey);
    if (value.length === 1) return;
    form.setFieldsValue({
      [formKey]: value.filter((key) => key !== value.length - 1),
    });
  }



  render() {
    const { error, data, onOk, onShowAsync, info, code } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    /**
     * 动态添加组件
     */
    getFieldDecorator('rewardFormKeys', { initialValue: info ? info.map((it, index) => index) : [] });
    const rewardFormKeys = getFieldValue('rewardFormKeys');
    const rewarItems = rewardFormKeys.map((k) => (
      <Form.Item label="兑换码设定" required={false} key={k} style={{ marginBottom: 0 }}>
        <InputGroup style={{ width: '94%' }} compact>
          <Form.Item style={{ width: '35%', textAlign: 'center' }}>
            {getFieldDecorator(`rewardType[${k}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              initialValue: info[k] ? info[k].type.toString() : '',
              rules: simpleRules('请选择类型!'),
            })(
              <Select style={{ width: '100%' }} placeholder="请选择类型">
                {data
                  ? data.map(
                    it => <Option key={it.id}>{it.name}</Option>)
                  : null}
              </Select>
            )}
          </Form.Item>
          <Form.Item style={{ width: '35%', textAlign: 'center' }}>
            {getFieldDecorator(`rewardItem[${k}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              initialValue: info[k] ? info[k].itemid.toString() : '',
              rules: simpleRules('请选择物品!'),
            })(
              <Select style={{ width: '100%' }} placeholder="请选择物品">
                {
                  getFieldValue(`rewardType[${k}]`) ?
                    data[getFieldValue(`rewardType[${k}]`) - 1].lcMatchRewards.map(it => <Option key={it.itemid}>{it.itemName}</Option>
                    ) : null}
              </Select>
            )}
          </Form.Item>
          <Form.Item style={{ width: '30%', textAlign: 'center' }}>
            {getFieldDecorator(`rewardNumber[${k}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              initialValue: info[k] ? info[k].num : '',
              rules: simpleRules('请输入数量!'),
            })(<InputNumber style={{ width: '100%' }} placeholder="数量" />)}
          </Form.Item>
        </InputGroup>
        {rewardFormKeys.length > 1 ? (
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            onClick={() => this.removeDynamicForm(k, 'rewardFormKeys')}
            style={{ position: 'absolute', top: '-9px', marginLeft: '4px' }}
          />
        ) : null}
      </Form.Item>
    ));

    return (

      <div>
        <span onClick={this.showModal} style={{ cursor: 'pointer', color: color.link }}>
          <Icon type="tool" style={{ marginRight: 4 }} />
          <span>修改</span>
        </span>
        <Modal
          title="修改兑换码配置"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          confirmLoading={this.state.loading}
        >
          {error ? (
            <Row gutter={8} style={{ marginBottom: 10 }}>
              <Col span={24}>
                <Alert type="error" showIcon message="添加出错" description={error} />
              </Col>
            </Row>
          ) : null}
          <Form onSubmit={this.handleSubmit} layout="horizontal">
            <Form.Item label="兑换码">
                { getFieldDecorator('code', {
                  initialValue: code,
                }) (
                  <Input style={{ width: '100%' }} disabled value = {code}></Input>
                )}
            </Form.Item>
            {rewarItems}
            <Form.Item
            // {...formLayout.formItemLayoutWithOutLabel}
            >
              <Button
                type="dashed"
                onClick={() => this.addDynamicForm('rewardFormKeys')}
                style={{ width: '100%' }}
              >
                <Icon type="plus" /> 修改兑换码配置
            </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

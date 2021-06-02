import { Icon } from '@ant-design/compatible';
import { Form } from '@ant-design/compatible';
import React, { Fragment } from "react";
import { Row, Col,  Button, InputNumber, Alert, Input, Select,  Modal } from "antd";
import FormSubmitModal from '../../../components/BaseComponents/FormSubmitModal';

const { Option } = Select;
const InputGroup = Input.Group;
const simpleRules = (message) => ([{ required: true, message }]);
/**
 * @augments {React.PureComponent<{
    onOk: (values: any, callback: Function) => any;
    onShowAsync?: Function
    data:any;
    error: any;
  }, {}>}
 */
@Form.create()
export default class NewRedeemCode extends React.Component {
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
    const { onOk, form } = this.props;
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

  keyDown(e) {
    if (e.keyCode === 8) {
          e.preventDefault();
      }
  }


  render() {
    const { error, data, onOk, onShowAsync } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;


    /**
     * 动态添加组件
     */
    getFieldDecorator('rewardFormKeys', { initialValue: [] });
    const rewardFormKeys = getFieldValue('rewardFormKeys');
    const rewarItems = rewardFormKeys.map((k) => (
      <Form.Item label="兑换码设定" required={false} key={k} style={{ marginBottom: 0 }}>
        <InputGroup style={{ width: '94%' }} compact>
          <Form.Item style={{ width: '35%', textAlign: 'center' }}>
            {getFieldDecorator(`rewardType[${k}]`, {
              validateTrigger: ['onChange', 'onBlur'],
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
        <Button onClick={this.showModal} icon="code" type="primary">添加兑换码配置</Button>
        <Modal
          title="添加兑换码配置"
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
            <Form.Item label="输入兑换码">
                { getFieldDecorator('code', {
                  rules:[{
                    min:4,
                    max:10,
                    pattern:'^[A-Za-z0-9]+$',
                  }]
                }) (
                  <Input placeholder="请输入兑换码" style={{ width: '100%' }} min={0} allowClear onKeyDown={this.keyDown}></Input>
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
                <Icon type="plus" /> 添加兑换物品
            </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>


      // <FormSubmitModal
      //   title="添加兑换码配置"
      //   formClassName="settingPopupForm"
      //   onShowAsync={onShowAsync}
      //   onOk={onOk}
      //   formProvider={form => {
      //     const { getFieldDecorator, getFieldValue } = form;

      //     const addDynamicForm = (formKey) => {
      //       const value = form.getFieldValue(formKey);
      //       const nextKeys = value.concat(value.length);
      //       form.setFieldsValue({ [formKey]: nextKeys });
      //     };

      //     const removeDynamicForm = (k, formKey) => {
      //       const value = form.getFieldValue(formKey);
      //       if (value.length === 1) return;
      //       form.setFieldsValue({
      //         [formKey]: value.filter((key) => key !== value.length - 1),
      //       });
      //     }


      //     /**
      //       * 动态添加组件
      //       */
      //     getFieldDecorator('rewardFormKeys', {
      //       initialValue: [],
      //     });
      //     const rewardFormKeys = getFieldValue('rewardFormKeys');
      //     const rewarItems = rewardFormKeys.map(k => (
      //       <Form.Item label="设定" required={false} key={k} style={{ marginBottom: 0 }}>
      //         <InputGroup style={{ width: '94%' }} compact>
      //           <Form.Item style={{ width: '12%', textAlign: 'center' }}>
      //             {getFieldDecorator(`rankingLeft[${k}]`, {
      //               validateTrigger: ['onChange', 'onBlur'],
      //               rules: simpleRules('请输入名次!'),
      //             })(<Input style={{ width: '100%', textAlign: 'center' }} placeholder="数字" />)}
      //           </Form.Item>
      //           <Form.Item style={{ width: '5%', textAlign: 'center' }}>
      //             <Input
      //               style={{
      //                 width: '100%',
      //                 borderLeft: 0,
      //                 pointerEvents: 'none',
      //                 backgroundColor: '#fff',
      //               }}
      //               placeholder="~"
      //               disabled
      //             />
      //           </Form.Item>

      //           <Form.Item style={{ width: '12%', textAlign: 'center' }}>
      //             {getFieldDecorator(`rankingRight[${k}]`, {
      //               validateTrigger: ['onChange', 'onBlur'],
      //               rules: simpleRules('请输名次!'),
      //             })(
      //               <Input
      //                 style={{ width: '100%', textAlign: 'center', borderLeft: 0 }}
      //                 placeholder="数字"
      //               />,
      //             )}
      //           </Form.Item>
      //           <Form.Item style={{ width: '20%', textAlign: 'center' }}>
      //             {getFieldDecorator(`rewardType[${k}]`, {
      //               validateTrigger: ['onChange', 'onBlur'],
      //               rules: simpleRules('请选择类型!'),
      //             })(
      //               <Select style={{ width: '100%' }} placeholder="请选择类型">
      //                 {data
      //                   ? data.map(
      //                     it => {
      //                       const value = `${it.id}*${it.cardType}*${it.name}`
      //                       return <Option value={value}>{it.name}</Option>
      //                     }
      //                   )
      //                   : null}
      //               </Select>,
      //             )}
      //           </Form.Item>
      //           <Form.Item style={{ width: '25%', textAlign: 'center' }}>
      //             {getFieldDecorator(`rewardItem[${k}]`, {
      //               validateTrigger: ['onChange', 'onBlur'],
      //               rules: simpleRules('请选择物品!'),
      //             })(
      //               <Select style={{ width: '100%' }} placeholder="请选择物品">
      //                 {
      //                   getFieldValue(`rewardType[${k}]`) ?
      //                     data[getFieldValue(`rewardType[${k}]`).split('*')[0] - 1].lcMatchRewards.map(it => {
      //                       const value = `${it.itemName}*${it.itemid}*${it.itemInfo}`
      //                       return <Option value={value}>{it.itemName}</Option>
      //                     }) : null}
      //               </Select>
      //             )}
      //           </Form.Item>
      //           <Form.Item style={{ width: '25%', textAlign: 'center' }}>
      //             {getFieldDecorator(`rewardNumber[${k}]`, {
      //               validateTrigger: ['onChange', 'onBlur'],
      //               rules: simpleRules('请输入数量!'),
      //             })(<InputNumber style={{ width: '100%' }} placeholder="数量" />)}
      //           </Form.Item>
      //         </InputGroup>
      //         {rewardFormKeys.length > 1 ? (
      //           <Icon
      //             className="dynamic-delete-button"
      //             type="minus-circle-o"
      //             onClick={removeDynamicForm(k, 'rewardFormKeys')}
      //             style={{ position: 'absolute', top: '-9px', marginLeft: '4px' }}
      //           />
      //         ) : null}
      //       </Form.Item>
      //     ));

      //     return (<Fragment>
      //       {error ? (
      //         <Row gutter={8} style={{ marginBottom: 10 }}>
      //           <Col span={24}>
      //             <Alert type="error" showIcon message="添加出错" description={error} />
      //           </Col>
      //         </Row>
      //       ) : null}


      //       <Row gutter={8}>
      //         <Col span={24}>
      //           {rewarItems}
      //         </Col>
      //       </Row>
      //       <Row gutter={8}>
      //         <Col span={24}>
      //           <Button
      //             type="dashed"
      //             onClick={addDynamicForm('rewardFormKeys')}
      //             style={{ width: '100%' }}
      //           >
      //             <Icon type="plus" /> 添加
      //       </Button>
      //         </Col>
      //       </Row>
      //     </Fragment>)
      //   }} >
      //   <Button icon="code" type="primary">添加兑换码配置</Button>
      // </FormSubmitModal>
    );
  }
}

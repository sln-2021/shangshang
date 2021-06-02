import { Icon } from '@ant-design/compatible';
import { Form } from '@ant-design/compatible';
import React, { Fragment } from 'react';
import {
  Row,
  Col,
  
  Button,
  Input,
  Alert,
  
  message,
  Select,
  TreeSelect,
  InputNumber,
} from 'antd';
import FormSubmitModal from '../../../components/BaseComponents/FormSubmitModal';

let bonusFormID = 0;
const InputGroup = Input.Group;
const { Option } = Select;
const { TextArea } = Input;
const { TreeNode } = TreeSelect;
const simpleRules = msg => [
  {
    required: true,
    message: msg,
  },
];
/**
 * @augments {React.PureComponent<{
    onOk: (values: any, callback: Function) => any;
    onShowAsync?: Function
    error: any;
    organizerTree: any;
    reward: any;
  }, {}>}
 */
export default class NewPropAndMail extends React.PureComponent {
  state = {
    playerInputDisplay: 'none',
    groupSelectDisplay: 'none',
  };

  onChangeSendType(v) {
    switch (v) {
      case 0:
        this.setState({
          playerInputDisplay: 'none',
          groupSelectDisplay: 'block',
        });
        break;
      case 1:
        this.setState({
          playerInputDisplay: 'none',
          groupSelectDisplay: 'block',
        });
        break;
      case 2:
        this.setState({
          playerInputDisplay: 'block',
          groupSelectDisplay: 'none',
        });
        break;
      default:
        break;
    }
  }

  removeBonusForm = k => {
    const { form } = this.props;
    const rewardFormKeys = form.getFieldValue('rewardFormKeys');
    if (rewardFormKeys.length === 1) return;
    form.setFieldsValue({
      rewardFormKeys: rewardFormKeys.filter(key => key !== k),
    });
  };

  addBonusForm = () => {
    const { form } = this.props;
    const rewardFormKeys = form.getFieldValue('rewardFormKeys');
    // eslint-disable-next-line no-plusplus
    const nextKeys = rewardFormKeys.concat(bonusFormID++);
    form.setFieldsValue({
      rewardFormKeys: nextKeys,
    });
  };

  render() {
    const { organizerTree, reward, error, onOk, onShowAsync } = this.props;
    const { playerInputDisplay, groupSelectDisplay } = this.state;

    return (
      <FormSubmitModal
        title="发送邮件道具"
        formClassName="settingPopupForm"
        onShowAsync={onShowAsync}
        onOk={onOk}
        formProvider={form => {
          const { getFieldDecorator, getFieldValue } = form;

          /**
           * 动态添加奖励组件
           */
          getFieldDecorator('rewardFormKeys', { initialValue: [] });
          const rewardFormKeys = getFieldValue('rewardFormKeys');
          const rewarItems = rewardFormKeys.map(k => (
            <Form.Item required={false} key={k} style={{ marginBottom: 0 }}>
              <InputGroup key="1" style={{ width: '94%' }} compact>
                <Form.Item style={{ width: '30%', textAlign: 'center' }}>
                  {getFieldDecorator(`rewardType[${k}]`, {
                    validateTrigger: ['onChange', 'onBlur'],
                    rules: [
                      {
                        required: true,
                        whitespace: true,
                        message: `请选择奖励类型`,
                      },
                    ],
                  })(
                    <Select key="12" style={{ width: '100%' }} placeholder="请选择奖励类型">
                      {reward ? reward.map(it => <Option key={it.id}>{it.name}</Option>) : null}
                    </Select>,
                  )}
                </Form.Item>
                <Form.Item style={{ width: '35%', textAlign: 'center' }}>
                  {getFieldDecorator(`rewardItem[${k}]`, {
                    validateTrigger: ['onChange', 'onBlur'],
                    rules: [
                      {
                        required: true,
                        whitespace: true,
                        message: `请选择奖励物品`,
                      },
                    ],
                  })(
                    <Select style={{ width: '100%' }} placeholder="请选择奖励物品">
                      {reward[getFieldValue(`rewardType[${k}]`) - 1]
                        ? reward[getFieldValue(`rewardType[${k}]`) - 1].lcMatchRewards.map(it => (
                            <Option key={it.itemid}>{it.itemName}</Option>
                          ))
                        : null}
                    </Select>,
                  )}
                </Form.Item>
                <Form.Item style={{ width: '35%', textAlign: 'center' }}>
                  {getFieldDecorator(`rewardNumber[${k}]`, {
                    validateTrigger: ['onChange', 'onBlur'],
                    rules: [
                      {
                        required: true,
                        whitespace: true,
                        message: `请输入奖励数量`,
                      },
                    ],
                  })(<InputNumber style={{ width: '100%' }} placeholder="数量" />)}
                </Form.Item>
              </InputGroup>
              {rewardFormKeys.length > 1 ? (
                <Icon
                  className="dynamic-delete-button"
                  type="minus-circle-o"
                  onClick={() => {
                    const rewardFormKey = form.getFieldValue('rewardFormKeys');
                    if (rewardFormKey.length === 1) return;
                    form.setFieldsValue({
                      rewardFormKeys: rewardFormKey.filter(key => key !== k),
                    });
                  }}
                  style={{ position: 'absolute', top: '-9px', marginLeft: '4px' }}
                />
              ) : null}
            </Form.Item>
          ));
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
                      rules: simpleRules('请填入邮件标题!'),
                    })(
                      <Input
                        style={{
                          width: '100%',
                        }}
                        placeholder="请填入邮件标题"
                      />,
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={8}>
                <Col span={24}> 收件人范围 </Col>
                <Col span={24}>
                  <Form.Item>
                    {form.getFieldDecorator('key', {
                      rules: simpleRules('请选择收件人范围!'),
                    })(
                      <Select
                        onChange={this.onChangeSendType.bind(this)}
                        style={{
                          width: '100%',
                        }}
                        key={1121}
                        placeholder="请选择收件人范围"
                      >
                        <Option value={1}> 渠道 </Option>
                        <Option value={2}> 选手 </Option>
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row
                gutter={8}
                style={{
                  display: groupSelectDisplay,
                }}
              >
                <Col span={24}> 收件人集合 </Col>
                <Col span={24}>
                  <Form.Item>
                    {form.getFieldDecorator('recipients', {
                      rules: [
                        {
                          required: groupSelectDisplay !== 'none' || false,
                          message: '请选择收件人集合',
                        },
                      ],
                    })(
                      <TreeSelect
                        style={{
                          width: '100%',
                        }}
                        dropdownStyle={{
                          maxHeight: 400,
                          overflow: 'auto',
                        }}
                        placeholder="请选择收件人集合"
                        allowClear
                      >
                        {organizerTree.map(it => (
                          <TreeNode
                            value={`{"type":${it.type},"id":${it.id}}`}
                            title={it.name}
                            key={it.id}
                          >
                            {it.clubNamesTVoList[0]
                              ? it.clubNamesTVoList.map(row => (
                                  <TreeNode
                                    value={`{"type":${row.type},"id":${row.id}}`}
                                    title={row.name}
                                    key={row.id}
                                  />
                                ))
                              : null}
                          </TreeNode>
                        ))}
                      </TreeSelect>,
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row
                gutter={8}
                style={{
                  display: playerInputDisplay,
                }}
              >
                <Col span={24}> 选手编号 </Col>
                <Col span={24}>
                  <Form.Item help="输入多个选手编号时请用逗号隔开，例如 10023，10056，10045">
                    {form.getFieldDecorator('recipientIds', {
                      rules: [
                        {
                          required: playerInputDisplay !== 'none' || false,
                          message: '请填入选手编号',
                        },
                      ],
                    })(
                      <TextArea
                        rows={2}
                        style={{
                          width: '100%',
                        }}
                        placeholder="请填入选手编号"
                      />,
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={8}>
                <Col span={24}> 道具 </Col>
                <Col span={24}>
                  {rewarItems}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => {
                        const key = form.getFieldValue('rewardFormKeys');
                        // eslint-disable-next-line no-plusplus
                        const nextKeys = key.concat(bonusFormID++);
                        form.setFieldsValue({
                          rewardFormKeys: nextKeys,
                        });
                      }}
                      style={{ width: '100%' }}
                    >
                      <Icon type="plus" /> 添加奖励
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={8}>
                <Col span={24}>邮件内容</Col>
                <Col span={24}>
                  <Form.Item>
                    {form.getFieldDecorator('content', {
                      rules: simpleRules('请填入邮件内容!'),
                    })(
                      <TextArea
                        rows={4}
                        style={{ width: '100%' }}
                        placeholder="请填入邮件内容题"
                      />,
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Fragment>
          );
        }}
      >
        <Button icon="rocket" type="primary">
          发送邮件道具
        </Button>
      </FormSubmitModal>
    );
  }
}

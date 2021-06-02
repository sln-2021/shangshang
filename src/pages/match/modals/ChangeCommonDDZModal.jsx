import { Icon } from '@ant-design/compatible';
import { Form } from '@ant-design/compatible';
import React, { Fragment } from 'react';
import { Row, Col,  Alert,  Select, Input, InputNumber } from 'antd';
import FormSubmitModal from '../../../components/BaseComponents/FormSubmitModal';
import '@ant-design/compatible/assets/index.css';

const { Option } = Select;
const { TextArea } = Input;
const InputGroup = Input.Group;
const simpleRules = message => [
  {
    required: true,
    message,
  },
];
/**
 * @augments {React.PureComponent<{
    onOk: (values: any, callback: Function) => any;
    onShowAsync?: Function;
    error: any;
    reward: any;
    info: any;
  }, {}>}
 */
export default class ChangeCommonDDZModal extends React.PureComponent {
  render() {
    const { error, onOk, onShowAsync, children, info, reward } = this.props;
    const rewardArr = JSON.parse(info.rewards);

    return (
      <FormSubmitModal
        title="修改斗地主普通场比赛"
        formClassName="settingPopupForm"
        onOk={onOk}
        onShowAsync={onShowAsync}
        formProvider={form => {
          const { getFieldDecorator, getFieldValue } = form;
          return (
            <Fragment>
              {error ? (
                <Alert
                  type="error"
                  showIcon
                  message="操作失败"
                  description={error}
                  style={{
                    marginBottom: 10,
                  }}
                />
              ) : null}
              <Row gutter={8}>
                <Col span={24}> 名称: </Col>
                <Col span={24}>
                  <Form.Item>
                    {getFieldDecorator('name', {
                      initialValue: info.name,
                      rules: simpleRules('请输入比赛名称！'),
                    })(<Input placeholder="请输入比赛名称" />)}
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={8}>
                <Col span={24}> 局数: </Col>
                <Col span={24}>
                  <Form.Item>
                    {getFieldDecorator('games', {
                      initialValue: info.games,
                      rules: simpleRules('请输入比赛局数!'),
                    })(
                      <InputNumber
                        style={{ width: '100%' }}
                        min={0}
                        placeholder="请输入比赛局数"
                      />,
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={8}>
                <Col span={24}> 比赛类型: </Col>
                <Col span={24}>
                  <Form.Item>
                    {getFieldDecorator('matchType', {
                      initialValue: info.matchType ? info.matchType : 1,
                      rules: simpleRules('请选择比赛类型'),
                    })(
                      <Select style={{ width: '100%' }} key="12313">
                        <Option value={1}>初级场</Option>
                        <Option value={2}>中级场</Option>
                        <Option value={3}>高级场</Option>
                        <Option value={4}>大师场</Option>
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={8}>
                <Col span={24}> 底分: </Col>
                <Col span={24}>
                  <Form.Item>
                    {getFieldDecorator('baseScore', {
                      initialValue: info.baseScore ? info.baseScore : 0,
                      rules: simpleRules('请输入底分!'),
                    })(
                      <InputNumber placeholder="请输入底分" style={{ width: '100%' }} min={0} />
                    )}
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={8}>
                <Col span={24}> 进入限制: </Col>
                <Col span={24}>
                  <Form.Item style={{ marginBottom: 0 }}>
                    <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
                      {getFieldDecorator('join_min', {
                        initialValue: info.joinMin,
                      })(
                        <InputNumber
                          style={{ width: '100%' }}
                          placeholder="请输入加入对局所需最少金币"
                        />,
                      )}
                    </Form.Item>
                    <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>
                      ~
                    </span>
                    <Form.Item
                      help="如填写正无穷请输入 -1 "
                      style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}
                    >
                      {getFieldDecorator('join_max', {
                        initialValue: info.joinMax,
                      })(
                        <InputNumber
                          style={{ width: '100%' }}
                          placeholder="请输入加入对局所需最多金币"
                        />,
                      )}
                    </Form.Item>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={8}>
                <Col span={24}> 单场报名费: </Col>
                <Col span={24}>
                  <Form.Item style={{ marginBottom: 0 }}>
                    <InputGroup style={{ width: '100%' }} compact>
                      <Form.Item style={{ width: '30%', textAlign: 'center' }}>
                        {getFieldDecorator(`applicationFeeType`, {
                          validateTrigger: ['onChange', 'onBlur'],
                          initialValue: info.costType,
                          rules: simpleRules('请选择报名费类型'),
                        })(
                          <Select style={{ width: '100%' }} placeholder="请选择报名费类型">
                            {reward[0]
                              ? reward
                                .filter(it => it.id !== 3)
                                .map(it => <Option value={it.id} key={it.id}>{it.name}</Option>)
                              : null}
                          </Select>,
                        )}
                      </Form.Item>
                      <Form.Item style={{ width: '35%', textAlign: 'center' }}>
                        {getFieldDecorator(`applicationFeeItem`, {
                          validateTrigger: ['onChange', 'onBlur'],
                          initialValue: info.costId,
                          rules: simpleRules('请选择报名物品'),
                        })(
                          <Select style={{ width: '100%' }} placeholder="请选择报名物品">
                            {reward[0] && getFieldValue('applicationFeeType')
                              ? reward[getFieldValue('applicationFeeType') - 1].lcMatchRewards
                                .filter(it => it.id !== 3)
                                .map(it => <Option value={it.itemid} key = {it.itemid}>{it.itemName}</Option>)
                              : null}
                          </Select>,
                        )}
                      </Form.Item>
                      <Form.Item style={{ width: '35%', textAlign: 'center' }}>
                        {getFieldDecorator(`applicationFeeNumber`, {
                          validateTrigger: ['onChange', 'onBlur'],
                          initialValue: info.costN,
                          rules: simpleRules('请填写报名需要数量'),
                        })(
                          <InputNumber
                            disabled={!getFieldValue('applicationFeeItem')}
                            style={{ width: '100%' }}
                            placeholder="数量"
                          />,
                        )}
                      </Form.Item>
                    </InputGroup>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={8}>
                <Col span={24}> 单个最高分奖励设定: </Col>
                <Col span={24}>
                  <Form.Item required={false} style={{ marginBottom: 0 }}>
                    <InputGroup key="1" style={{ width: '100%' }} compact>
                      <Form.Item style={{ width: '30%', textAlign: 'center' }}>
                        {getFieldDecorator(`rewardType-1`, {
                          validateTrigger: ['onChange', 'onBlur'],
                          initialValue: rewardArr[0].type,
                          rules: simpleRules('请选择奖励类型'),
                        })(
                          <Select key="12" style={{ width: '100%' }} placeholder="请选择奖励类型">
                            {reward
                              ? reward.map(it => <Option value={it.id} key={it.id}>{it.name}</Option>)
                              : null}
                          </Select>,
                        )}
                      </Form.Item>
                      <Form.Item style={{ width: '35%', textAlign: 'center' }}>
                        {getFieldDecorator(`rewardItem-1`, {
                          validateTrigger: ['onChange', 'onBlur'],
                          initialValue: rewardArr[0].itemid,
                          rules: simpleRules('请选择奖励物品'),
                        })(
                          <Select style={{ width: '100%' }} placeholder="请选择奖励物品">
                            {reward[getFieldValue('rewardType-1') - 1]
                              ? reward[getFieldValue('rewardType-1') - 1].lcMatchRewards.map(it => (
                                <Option value={it.itemid} key = {it.itemid}>{it.itemName}</Option>
                              ))
                              : null}
                          </Select>,
                        )}
                      </Form.Item>
                      <Form.Item style={{ width: '35%', textAlign: 'center' }}>
                        {getFieldDecorator(`rewardNumber-1`, {
                          validateTrigger: ['onChange', 'onBlur'],
                          initialValue: rewardArr[0].num,
                          rules: simpleRules('请输入奖励数量'),
                        })(<InputNumber style={{ width: '100%' }} placeholder="数量" />)}
                      </Form.Item>
                    </InputGroup>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={8}>
                <Col span={24}> 两个最高分奖励设定: </Col>
                <Col span={24}>
                  <Form.Item required={false} style={{ marginBottom: 0 }}>
                    <InputGroup key="1" style={{ width: '100%' }} compact>
                      <Form.Item style={{ width: '30%', textAlign: 'center' }}>
                        {getFieldDecorator(`rewardType-2`, {
                          validateTrigger: ['onChange', 'onBlur'],
                          initialValue: rewardArr[1].type,
                          rules: simpleRules('请选择奖励类型'),
                        })(
                          <Select key="12" style={{ width: '100%' }} placeholder="请选择奖励类型">
                            {reward
                              ? reward.map(it => <Option key={it.id} value={it.id}>{it.name}</Option>)
                              : null}
                          </Select>,
                        )}
                      </Form.Item>
                      <Form.Item style={{ width: '35%', textAlign: 'center' }}>
                        {getFieldDecorator(`rewardItem-2`, {
                          validateTrigger: ['onChange', 'onBlur'],
                          initialValue: rewardArr[1].itemid,
                          rules: simpleRules('请选择奖励物品'),
                        })(
                          <Select style={{ width: '100%' }} placeholder="请选择奖励物品">
                            {reward[getFieldValue('rewardType-2') - 1]
                              ? reward[getFieldValue('rewardType-2') - 1].lcMatchRewards.map(it => (
                                <Option value={it.itemid} key = {it.itemid}>{it.itemName}</Option>
                              ))
                              : null}
                          </Select>,
                        )}
                      </Form.Item>
                      <Form.Item style={{ width: '35%', textAlign: 'center' }}>
                        {getFieldDecorator(`rewardNumber-2`, {
                          validateTrigger: ['onChange', 'onBlur'],
                          initialValue: rewardArr[1].num,
                          rules: simpleRules('请输入奖励数量'),
                        })(<InputNumber style={{ width: '100%' }} placeholder="数量" />)}
                      </Form.Item>
                    </InputGroup>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={8}>
                <Col span={24}> 三个最高分奖励设定: </Col>
                <Col span={24}>
                  <Form.Item required={false} style={{ marginBottom: 0 }}>
                    <InputGroup key="1" style={{ width: '100%' }} compact>
                      <Form.Item style={{ width: '30%', textAlign: 'center' }}>
                        {getFieldDecorator(`rewardType-3`, {
                          validateTrigger: ['onChange', 'onBlur'],
                          initialValue: rewardArr[2].type,
                          rules: simpleRules('请选择奖励类型'),
                        })(
                          <Select key="12" style={{ width: '100%' }} placeholder="请选择奖励类型">
                            {reward
                              ? reward.map(it => <Option key={it.id} value={it.id}>{it.name}</Option>)
                              : null}
                          </Select>,
                        )}
                      </Form.Item>
                      <Form.Item style={{ width: '35%', textAlign: 'center' }}>
                        {getFieldDecorator(`rewardItem-3`, {
                          validateTrigger: ['onChange', 'onBlur'],
                          initialValue: rewardArr[2].itemid,
                          rules: simpleRules('请选择奖励物品'),
                        })(
                          <Select style={{ width: '100%' }} placeholder="请选择奖励物品">
                            {reward[getFieldValue('rewardType-3') - 1]
                              ? reward[getFieldValue('rewardType-3') - 1].lcMatchRewards.map(it => (
                                <Option value={it.itemid} key = {it.itemid}>{it.itemName}</Option>
                              ))
                              : null}
                          </Select>,
                        )}
                      </Form.Item>
                      <Form.Item style={{ width: '35%', textAlign: 'center' }}>
                        {getFieldDecorator(`rewardNumber-3`, {
                          validateTrigger: ['onChange', 'onBlur'],
                          initialValue: rewardArr[2].num,
                          rules: simpleRules('请输入奖励数量'),
                        })(<InputNumber style={{ width: '100%' }} placeholder="数量" />)}
                      </Form.Item>
                    </InputGroup>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={8}>
                <Col span={24}> 赛事简介: </Col>
                <Col span={24}>
                  <Form.Item>
                    {getFieldDecorator('intro', {
                      initialValue: info.intro,
                    })(
                      <TextArea placeholder="请输入赛事简介" rows={3} style={{ width: '100%' }} />,
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Fragment>
          );
        }}
      >
        {children}
      </FormSubmitModal>
    );
  }
}

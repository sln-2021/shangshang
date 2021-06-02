/* eslint-disable no-useless-computed-key */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable prefer-template */
import _ from 'lodash';
import React from 'react';
import { Card,  Input, Select, message, InputNumber, Button, Alert, Icon } from 'antd';
import { connect } from 'umi';
import { easyDispatch, easyRouteTo } from '@/utils/easyDispatch';
import { history as router } from 'umi';
import * as formLayout from './formLayout';
import { GameStateType } from '../../../../models/games';
import { OrganizerStateType } from '../../../../models/organizer';
import { Form } from '@ant-design/compatible';
const { TextArea } = Input;
const InputGroup = Input.Group;
const { Option } = Select;
const landlordsCommon: string = '1';
const simpleRules = (msg: string) => [{ required: true, message: msg }];

type P = {
  loadingaddLandlordsCommon: boolean;
  form: any;
  reward: any;
  organizerTree: any;
};

type S = {
  error: string;
  formValues: {
    name: string;
    games: number;
    isRobot: number;
    matchType: '1' | '2' | '3' | '4';
    join_min: number;
    join_max: number;
    applicationFeeType: '1' | '2' | '3';
    applicationFeeItem: string;
    applicationFeeNumber: string;
    intro: string;
  };
};

type Request = {
  status: number;
  statusText: string;
};

class CreateCommonDDZ extends React.Component<P, S> {
  state = {
    error: '',
    formValues: {
      // name: Mock.mock('@cname'),
      // games: Mock.mock('@integer(1, 100)'),
      // isRobot: Mock.mock('@integer(0, 1)'),
      // matchType: Mock.mock('@string("1234", 1)'),
      // join_min: Mock.mock('@integer(2000, 4000)'),
      // join_max: Mock.mock('@integer(4001, 8000)'),
      // applicationFeeType: Mock.mock('@string("1", 1)'),
      // applicationFeeItem: Mock.mock('@string("1", 1)'),
      // applicationFeeNumber: Mock.mock('@integer(1000, 8000)'),
      // ['rewardType-1']: Mock.mock('@string("1", 1)'),
      // ['rewardItem-1']: Mock.mock('@string("123", 1)'),
      // ['rewardNumber-1']: Mock.mock('@integer(1000, 8000)'),
      // ['rewardType-2']: Mock.mock('@string("1", 1)'),
      // ['rewardItem-2']: Mock.mock('@string("123", 1)'),
      // ['rewardNumber-2']: Mock.mock('@integer(1000, 8000)'),
      // ['rewardType-3']: Mock.mock('@string("1", 1)'),
      // ['rewardItem-3']: Mock.mock('@string("123", 1)'),
      // ['rewardNumber-3']: Mock.mock('@integer(1000, 8000)'),
      // extrosFormKeys: Mock.mock('@shuffle([0,1,2])'),
      // extrosPools: Mock.mock('@shuffle([1,2,3,4,5,6])'),
      // extrosRates: Mock.mock('@shuffle([30,40,70,80,90,100])'),
      // intro: Mock.mock('@cparagraph'),
    },
  };

  componentDidMount() {
    this.init();
  }

  onError(response: Request) {
    this.setState({ error: response.statusText });
  }

  // eslint-disable-next-line react/sort-comp
  clearError() {
    this.setState({ error: '' });
  }

  init() {
    easyDispatch(this, 'games/fetchReward', {
      onError: () => message.error('获取奖品下拉列表失败'),
    });
    easyDispatch(this, 'organizer/fetchOrganizerTree', {
      onError: () => message.error('获取下拉列表失败'),
    });
  }

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err: unknown, values: any) => {
      if (err) return;

      /** 格式化 奖励数组对象 */
      const rewards: any = [
        {
          type: +values['rewardType-1'],
          itemid: +values['rewardItem-1'],
          num: +values['rewardNumber-1'],
        },
        {
          type: +values['rewardType-2'],
          itemid: +values['rewardItem-2'],
          num: +values['rewardNumber-2'],
        },
        {
          type: +values['rewardType-3'],
          itemid: +values['rewardItem-3'],
          num: +values['rewardNumber-3'],
        },
      ];

      /** 格式化 机器人难度数据 */
      const extros = values.isRobot
        ? JSON.stringify({
            rates: [...values.extrosRates.map(it => parseInt(it))],
            pools: [...values.extrosPools],
          })
        : null;

      easyDispatch(this, 'games/addLandlordsCommon', {
        // 普通字符串数据
        ..._.pick(
          values,
          'name',
          'games',
          'isRobot',
          'matchType',
          'join_min',
          'join_max',
          'intro',
          'baseScore',
        ),

        cost_type: values.applicationFeeType,
        cost_id: values.applicationFeeItem,
        cost_n: values.applicationFeeNumber,

        // 普通赛事比赛类型名称：ddztrain（斗地主）tdhtrain(推倒胡)
        gamename: 'ddztrain',
        // 机器人设置 JSON
        extros: values.isRobot ? extros.toString() : null,

        rewards: JSON.stringify(rewards).toString(),
        // 回调方法处理事务
        onError: (code: any) => {
          message.error(code.statusText);
          this.onError(code);
        },
        onOk: () => {
          message.success('申请比赛成功!');
          // 重置表单
          this.props.form.resetFields();
          router.push(`/match/index?tab=${landlordsCommon}`);
        },
      });
    });
  };

  addDynamicForm(formKey: string) {
    const { form } = this.props;
    const value = form.getFieldValue(formKey);
    const nextKeys = value.concat(value.length);
    form.setFieldsValue({ [formKey]: nextKeys });
  }

  removeDynamicForm(k: number, formKey: string) {
    const { form } = this.props;
    const value = form.getFieldValue(formKey);
    if (value.length === 1) return;
    form.setFieldsValue({
      [formKey]: value.filter((key: number) => key !== value.length - 1),
    });
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { loadingaddLandlordsCommon, reward } = this.props;
    const { error, formValues } = this.state;

    /**
     * 动态添加机器人难度
     */
    getFieldDecorator('extrosFormKeys', { initialValue: formValues.extrosFormKeys || [] });
    const extrosFormKeys = getFieldValue('extrosFormKeys');
    const extrosItems = extrosFormKeys.map((k: number) => (
      <Form.Item label="机器人难度配置" required={false} key={k} style={{ marginBottom: 0 }}>
        <InputGroup style={{ width: '94%' }} compact>
          <Form.Item style={{ width: '50%', textAlign: 'center' }}>
            {getFieldDecorator(`extrosPools[${k}]`, {
              // initialValue: formValues.extrosPools[k],
              rules: simpleRules('请选择档位!'),
            })(
              <Select style={{ width: '100%' }} placeholder="请选择档位">
                <Option value={1}>超级</Option>
                <Option value={2}>高级</Option>
                <Option value={3}>中级</Option>
                <Option value={4}>初级</Option>
                <Option value={5}>入门级</Option>
                <Option value={6}>无脑级</Option>
              </Select>,
            )}
          </Form.Item>
          <Form.Item style={{ width: '50%', textAlign: 'center' }}>
            {getFieldDecorator(`extrosRates[${k}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              // initialValue: formValues.extrosRates[k],
              rules: simpleRules('请输入难度比率'),
            })(<InputNumber style={{ width: '100%' }} placeholder="数字" />)}
          </Form.Item>
        </InputGroup>
        {extrosFormKeys.length > 1 ? (
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            onClick={this.removeDynamicForm.bind(this, k, 'extrosFormKeys')}
            style={{ position: 'absolute', top: '-9px', marginLeft: '4px' }}
          />
        ) : null}
      </Form.Item>
    ));

    return (
      <Form {...formLayout.formItemLayout} onSubmit={this.handleSubmit} layout="horizontal">
        <Card bordered={false} loading={false}>
          {error && <Alert message="错误" description={error} type="error" showIcon />}
          <Form.Item label="名称">
            {getFieldDecorator('name', {
              initialValue: formValues.name,
              rules: simpleRules('请输入比赛名称！'),
            })(<Input placeholder="请输入比赛名称" />)}
          </Form.Item>

          <Form.Item label="局数">
            {getFieldDecorator('games', {
              initialValue: formValues.games,
              rules: simpleRules('请输入比赛局数!'),
            })(<InputNumber style={{ width: '100%' }} min={0} placeholder="请输入比赛局数" />)}
          </Form.Item>

          <Form.Item label="是否加入机器人">
            {getFieldDecorator('isRobot', {
              initialValue: formValues.isRobot,
              rules: simpleRules('请选择是否加入机器人!'),
            })(
              <Select
                placeholder="请选择是否加入机器人"
                onChange={(e: number) => {
                  const data = formValues;
                  this.setState({ formValues: { ...data, isRobot: e } });
                }}
              >
                <Option value={0}>否</Option>
                <Option value={1}>是</Option>
              </Select>,
            )}
          </Form.Item>

          <Form.Item label="比赛类型">
            {getFieldDecorator('matchType', {
              initialValue: formValues.matchType,
              rules: simpleRules('matchType'),
            })(
              <Select style={{ width: '100%' }} placeholder="请选择比赛类型">
                <Option value={1}>初级场</Option>
                <Option value={2}>中级场</Option>
                <Option value={3}>高级场</Option>
                <Option value={4}>大师场</Option>
              </Select>,
            )}
          </Form.Item>

          <Form.Item label="底分">
            {getFieldDecorator('baseScore', {
              rules: simpleRules('请输入底分!'),
            })(<InputNumber placeholder="请输入底分" style={{ width: '100%' }} min={0} />)}
          </Form.Item>

          <Form.Item label="进入限制" style={{ marginBottom: 0 }}>
            <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
              {getFieldDecorator('join_min', {
                initialValue: formValues.join_min,
              })(
                <InputNumber style={{ width: '100%' }} placeholder="请输入加入对局所需最少金币" />,
              )}
            </Form.Item>
            <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>~</span>
            <Form.Item
              help="如填写正无穷请输入 -1 "
              style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}
            >
              {getFieldDecorator('join_max', {
                initialValue: formValues.join_max,
              })(
                <InputNumber style={{ width: '100%' }} placeholder="请输入加入对局所需最多金币" />,
              )}
            </Form.Item>
          </Form.Item>

          <Form.Item label="单场报名费" style={{ marginBottom: 0 }}>
            <InputGroup style={{ width: '100%' }} compact>
              <Form.Item style={{ width: '30%', textAlign: 'center' }}>
                {getFieldDecorator(`applicationFeeType`, {
                  validateTrigger: ['onChange', 'onBlur'],
                  initialValue: formValues.applicationFeeType,
                  rules: simpleRules('请选择报名费类型'),
                })(
                  <Select style={{ width: '100%' }} placeholder="请选择报名费类型">
                    {reward[0]
                      ? reward
                          .filter(
                            (it: {
                              id: number;
                              lcMatchRewards: [
                                {
                                  icon: string;
                                  id: number;
                                  itemName: string;
                                  itemid: number;
                                  name: string;
                                  type: number;
                                },
                              ];
                              name: string;
                            }) => it.id !== 3,
                          )
                          .map(
                            (it: {
                              id: number;
                              lcMatchRewards: [
                                {
                                  icon: string;
                                  id: number;
                                  itemName: string;
                                  itemid: number;
                                  name: string;
                                  type: number;
                                },
                              ];
                              name: string;
                            }) => {
                              const value = `${it.id}*${it.cardType}*${it.name}`;
                              return <Option value={value}>{it.name}</Option>;
                            },
                          )
                      : null}
                  </Select>,
                )}
              </Form.Item>
              <Form.Item style={{ width: '35%', textAlign: 'center' }}>
                {getFieldDecorator(`applicationFeeItem`, {
                  validateTrigger: ['onChange', 'onBlur'],
                  initialValue: formValues.applicationFeeItem,
                  rules: simpleRules('请选择报名物品'),
                })(
                  <Select style={{ width: '100%' }} placeholder="请选择报名物品">
                    {reward[0] && getFieldValue('applicationFeeType')
                      ? reward[getFieldValue('applicationFeeType') - 1].lcMatchRewards
                          .filter(
                            (it: {
                              icon: string;
                              id: number;
                              itemName: string;
                              itemid: number;
                              name: string;
                              type: number;
                            }) => it.id !== 3,
                          )
                          .map(it => {
                            const value = `${it.itemName}*${it.itemid}*${it.itemInfo}`;
                            return <Option value={value}>{it.itemName}</Option>;
                          })
                      : null}
                  </Select>,
                )}
              </Form.Item>
              <Form.Item style={{ width: '35%', textAlign: 'center' }}>
                {getFieldDecorator(`applicationFeeNumber`, {
                  validateTrigger: ['onChange', 'onBlur'],
                  initialValue: formValues.applicationFeeNumber,
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

          <Form.Item label="单个最高分奖励设定" required={false} style={{ marginBottom: 0 }}>
            <InputGroup key="1" style={{ width: '100%' }} compact>
              <Form.Item style={{ width: '30%', textAlign: 'center' }}>
                {getFieldDecorator(`rewardType-1`, {
                  validateTrigger: ['onChange', 'onBlur'],
                  initialValue: formValues['rewardType-1'],
                  rules: simpleRules('请选择奖励类型'),
                })(
                  <Select key="12" style={{ width: '100%' }} placeholder="请选择奖励类型">
                    {reward
                      ? reward.map(
                          (it: {
                            id: string;
                            lcMatchRewards: [
                              {
                                icon: string;
                                id: number;
                                itemName: string;
                                itemid: number;
                                name: string;
                                type: number;
                              },
                            ];
                            name: string;
                          }) => <Option value={it.id}>{it.name}</Option>,
                        )
                      : null}
                  </Select>,
                )}
              </Form.Item>
              <Form.Item style={{ width: '35%', textAlign: 'center' }}>
                {getFieldDecorator(`rewardItem-1`, {
                  validateTrigger: ['onChange', 'onBlur'],
                  initialValue: formValues['rewardItem-1'],
                  rules: simpleRules('请选择奖励物品'),
                })(
                  <Select style={{ width: '100%' }} placeholder="请选择奖励物品">
                    {reward[getFieldValue('rewardType-1') - 1]
                      ? reward[getFieldValue('rewardType-1') - 1].lcMatchRewards.map(it => (
                          <Option value={it.itemid}>{it.itemName}</Option>
                        ))
                      : null}
                  </Select>,
                )}
              </Form.Item>
              <Form.Item style={{ width: '35%', textAlign: 'center' }}>
                {getFieldDecorator(`rewardNumber-1`, {
                  validateTrigger: ['onChange', 'onBlur'],
                  initialValue: formValues['rewardNumber-1'],
                  rules: simpleRules('请输入奖励数量'),
                })(<InputNumber style={{ width: '100%' }} placeholder="数量" />)}
              </Form.Item>
            </InputGroup>
          </Form.Item>

          <Form.Item label="两个最高分奖励设定" required={false} style={{ marginBottom: 0 }}>
            <InputGroup key="1" style={{ width: '100%' }} compact>
              <Form.Item style={{ width: '30%', textAlign: 'center' }}>
                {getFieldDecorator(`rewardType-2`, {
                  validateTrigger: ['onChange', 'onBlur'],
                  initialValue: formValues['rewardType-2'],
                  rules: simpleRules('请选择奖励类型'),
                })(
                  <Select key="12" style={{ width: '100%' }} placeholder="请选择奖励类型">
                    {reward
                      ? reward.map(
                          (it: {
                            id: string;
                            lcMatchRewards: [
                              {
                                icon: string;
                                id: number;
                                itemName: string;
                                itemid: number;
                                name: string;
                                type: number;
                              },
                            ];
                            name: string;
                          }) => <Option value={it.id}>{it.name}</Option>,
                        )
                      : null}
                  </Select>,
                )}
              </Form.Item>
              <Form.Item style={{ width: '35%', textAlign: 'center' }}>
                {getFieldDecorator(`rewardItem-2`, {
                  validateTrigger: ['onChange', 'onBlur'],
                  initialValue: formValues['rewardItem-2'],
                  rules: simpleRules('请选择奖励物品'),
                })(
                  <Select style={{ width: '100%' }} placeholder="请选择奖励物品">
                    {reward[getFieldValue('rewardType-2') - 1]
                      ? reward[getFieldValue('rewardType-2') - 1].lcMatchRewards.map(it => (
                          <Option value={it.itemid}>{it.itemName}</Option>
                        ))
                      : null}
                  </Select>,
                )}
              </Form.Item>
              <Form.Item style={{ width: '35%', textAlign: 'center' }}>
                {getFieldDecorator(`rewardNumber-2`, {
                  validateTrigger: ['onChange', 'onBlur'],
                  initialValue: formValues['rewardNumber-2'],
                  rules: simpleRules('请输入奖励数量'),
                })(<InputNumber style={{ width: '100%' }} placeholder="数量" />)}
              </Form.Item>
            </InputGroup>
          </Form.Item>

          <Form.Item label="三个最高分奖励设定" required={false} style={{ marginBottom: 0 }}>
            <InputGroup key="1" style={{ width: '100%' }} compact>
              <Form.Item style={{ width: '30%', textAlign: 'center' }}>
                {getFieldDecorator(`rewardType-3`, {
                  validateTrigger: ['onChange', 'onBlur'],
                  initialValue: formValues['rewardType-3'],
                  rules: simpleRules('请选择奖励类型'),
                })(
                  <Select key="12" style={{ width: '100%' }} placeholder="请选择奖励类型">
                    {reward
                      ? reward.map(
                          (it: {
                            id: string;
                            lcMatchRewards: [
                              {
                                icon: string;
                                id: number;
                                itemName: string;
                                itemid: number;
                                name: string;
                                type: number;
                              },
                            ];
                            name: string;
                          }) => <Option value={it.id}>{it.name}</Option>,
                        )
                      : null}
                  </Select>,
                )}
              </Form.Item>
              <Form.Item style={{ width: '35%', textAlign: 'center' }}>
                {getFieldDecorator(`rewardItem-3`, {
                  validateTrigger: ['onChange', 'onBlur'],
                  initialValue: formValues['rewardItem-3'],
                  rules: simpleRules('请选择奖励物品'),
                })(
                  <Select style={{ width: '100%' }} placeholder="请选择奖励物品">
                    {reward[getFieldValue('rewardType-3') - 1]
                      ? reward[getFieldValue('rewardType-3') - 1].lcMatchRewards.map(it => (
                          <Option value={it.itemid}>{it.itemName}</Option>
                        ))
                      : null}
                  </Select>,
                )}
              </Form.Item>
              <Form.Item style={{ width: '35%', textAlign: 'center' }}>
                {getFieldDecorator(`rewardNumber-3`, {
                  validateTrigger: ['onChange', 'onBlur'],
                  initialValue: formValues['rewardNumber-3'],
                  rules: simpleRules('请输入奖励数量'),
                })(<InputNumber style={{ width: '100%' }} placeholder="数量" />)}
              </Form.Item>
            </InputGroup>
          </Form.Item>

          <div
            style={{
              display: `${
                this.state.formValues.isRobot === 0 && getFieldValue('isRobot') === 0
                  ? 'none'
                  : 'block'
              }`,
            }}
          >
            {extrosItems}
            <Form.Item
              {...formLayout.formItemLayoutWithOutLabel}
              extra={
                <p style={{ padding: 0, margin: 0 }}>
                  例:超级为50，高级为50，那么他们各自的出场率为50%
                </p>
              }
            >
              <Button
                type="dashed"
                onClick={this.addDynamicForm.bind(this, 'extrosFormKeys')}
                style={{ width: '100%' }}
              >
                <Icon type="plus" /> 设置机器人难度
              </Button>
            </Form.Item>
          </div>

          <Form.Item label="赛事简介">
            {getFieldDecorator('intro', {
              rules: simpleRules('请输入赛事简介!'),
              initialValue: formValues.intro,
            })(<TextArea placeholder="请输入赛事简介" rows={3} style={{ width: '100%' }} />)}
          </Form.Item>

          <Form.Item {...formLayout.tailFormItemLayout}>
            <Button loading={loadingaddLandlordsCommon} type="primary" htmlType="submit">
              提交
            </Button>
            <Button
              type="default"
              onClick={() => easyRouteTo(this, '/match/index')}
              style={{ marginLeft: 10 }}
            >
              返回
            </Button>
          </Form.Item>
        </Card>
      </Form>
    );
  }
}

export default connect(
  ({
    games,
    organizer: { organizerTree },
    loading,
  }: {
    games: GameStateType;
    organizer: OrganizerStateType;
    loading: {
      effects: {
        [key: string]: boolean;
      };
    };
    reward: any;
  }) => ({
    games,
    organizerTree,
    loadingaddLandlordsCommon: loading.effects['games/addLandlordsCommon'],
    reward: games.reward,
  }),
)(Form.create()(CreateCommonDDZ));

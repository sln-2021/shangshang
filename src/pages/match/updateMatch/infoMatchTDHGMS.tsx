/* eslint-disable react/jsx-no-bind */
/* eslint-disable prefer-template */
import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import {
  Card,

  Input,
  Select,
  message,
  DatePicker,
  InputNumber,
  Upload,
  Button,
  Icon,
  TimePicker,
  Alert,
} from 'antd';
import { connect } from 'umi';
import { easyDispatch, easyRouteTo } from '@/utils/easyDispatch';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { history as router } from 'umi';
import * as formLayout from './formLayout';
import { GameStateType } from '../../../../models/games';
import { OrganizerStateType } from '../../../../models/organizer';
import { Form } from '@ant-design/compatible';
const { RangePicker } = DatePicker;
const InputGroup = Input.Group;
const { Option } = Select;
const { TextArea } = Input;
const createLandlordsMatch: string = '2';
const simpleRules = (msg: string) => [{ required: true, message: msg }];

type P = {
  loadingaddLandlordsMatch: boolean;
  form: any;
  reward: any;
  organizerTree: any;
};

type S = {
  error: string;
  isUpload: boolean;
  formValues: any;
  oneLogo: string;
  twoLogo: string;
  threeLogo: string;
  fourLogo: string;
  fiveLogo: string;
  oneLogoLoading: boolean;
  twoLogoLoading: boolean;
  threeLogoLoading: boolean;
  fourLogoLoading: boolean;
  fiveLogoLoading: boolean;
};

type Request = {
  status: number;
  msg: string;
};

type UploadButton = {
  loading?: string;
};

const UploadButton: React.FC<UploadButton> = props => {
  const { loading } = props;
  return (
    <div>
      <Icon type={loading ? 'loading' : 'plus'} />
      <div className="ant-upload-text">上传</div>
    </div>
  );
};

class CreateLandlordsGMSMatch extends React.Component<P, S> {
  loginForm: FormComponentProps['form'] | undefined | null = undefined;

  state = {
    error: '',
    isUpload: false,
    formValues: {},
    oneLogo: '',
    twoLogo: '',
    threeLogo: '',
    fourLogo: '',
    fiveLogo: '',
    oneLogoLoading: false,
    twoLogoLoading: false,
    threeLogoLoading: false,
    fourLogoLoading: false,
    fiveLogoLoading: false,
  };

  componentDidMount() {
    this.init();
  }

  onError(response: Request) {
    this.setState({ error: response.msg });
  }

  // eslint-disable-next-line react/sort-comp
  clearError() {
    this.setState({ error: '' });
  }

  init() {
    const id = location.search.split('=')[1];
    easyDispatch(this, 'games/fetchLandlordsGMSMatchByID', {
      matchId: id,
      onError: () => message.error('获取比赛详情失败'),
      onOk: (res: any) => {
        console.log(
          `${JSON.parse(res.registrationJson).type}*${JSON.parse(res.registrationJson).cardType}*${
            JSON.parse(res.registrationJson).name
          }`,
        );

        console.log(JSON.parse(res.registrationJson));

        this.setState({ formValues: res });
        this.props.form.setFieldsValue({
          ...res,
          repeatInterval: res.repeatInterval / 60,
          numberCompetitors: res.numberCompetitors,
          cycleTime: [moment(res.startTime), moment(res.stopTime)],
          dayBeginTime: moment(res.dayBeginTimeStr, 'HH:mm'),
          dayEndTime: moment(res.dayEndTimeStr, 'HH:mm'),

          applicationFeeType: res.registrationJson
            ? `${JSON.parse(res.registrationJson).type}*${
                JSON.parse(res.registrationJson).cardType
              }*${JSON.parse(res.registrationJson).name}`
            : [],
          applicationFeeItem: res.registrationJson
            ? `${JSON.parse(res.registrationJson).itemName}*${
                JSON.parse(res.registrationJson).itemid
              }*${JSON.parse(res.registrationJson).itemInfo}`
            : [],
          applicationFeeNumber: res.registrationJson ? JSON.parse(res.registrationJson).num : [],
          applicationFeeLevel: res.registrationJson ? JSON.parse(res.registrationJson).level : [],

          extrosFormKeys:
            res.extros && JSON.parse(res.extros)
              ? JSON.parse(res.extros).pools.map((it, index) => index)
              : [],
          extrosPools: res.extros && JSON.parse(res.extros) ? JSON.parse(res.extros).pools : [],
          extrosRates: res.extros && JSON.parse(res.extros) ? JSON.parse(res.extros).rates : [],
          rewardFormKeys: res.rankRewardsJson
            ? JSON.parse(res.rankRewardsJson).map((it, index) => index)
            : [],
          rankingLeft: res.rankRewardsJson
            ? JSON.parse(res.rankRewardsJson).map(it => it.rank[0])
            : [],
          rankingRight: res.rankRewardsJson
            ? JSON.parse(res.rankRewardsJson).map(it => it.rank[1])
            : [],
          rewardType: res.rankRewardsJson
            ? JSON.parse(res.rankRewardsJson).map(
                it => `${it.reward[0].type}*${it.reward[0].cardType}*${it.reward[0].name}`,
              )
            : [],
          rewardItem: res.rankRewardsJson
            ? JSON.parse(res.rankRewardsJson).map(
                it => `${it.reward[0].itemName}*${it.reward[0].itemid}*${it.reward[0].itemInfo}`,
              )
            : [],
          rewardNumber: res.rankRewardsJson
            ? JSON.parse(res.rankRewardsJson).map(it => it.reward[0].num)
            : [],
        });
      },
    });
    easyDispatch(this, 'games/fetchReward', {
      onError: () => message.error('获取奖品下拉列表失败'),
    });
    easyDispatch(this, 'organizer/fetchOrganizerTree', {
      onError: () => message.error('获取下拉列表失败'),
    });
    easyDispatch(this, 'brand/fetchBrandType', {
      onError: () => message.error('获取冠名下拉列表失败'),
    });
  }

  onChangeFormValue() {
    const { setFieldsValue, getFieldsValue } = this.props.form;
    const { type, cycleTime, dayBeginTime, dayEndTime, repeatInterval } = getFieldsValue();

    if (type === 2) {
      setFieldsValue({ repeatInterval: 0 });
    } else {
      const gameDays = cycleTime ? cycleTime[1].diff(cycleTime[0], 'days') + 1 : null;
      const dailyGameTime = dayEndTime
        ? moment(dayEndTime, 'kk:mm').diff(moment(dayBeginTime, 'kk:mm'), 'minutes', true)
        : null;
      const gamePlayed = gameDays * Math.floor(dailyGameTime / repeatInterval) || 0;
      if (gamePlayed === Infinity) {
        setFieldsValue({ totalMatches: 0 });
      } else {
        setFieldsValue({ totalMatches: gamePlayed });
      }
      // console.log(`
      //   比赛日期的天数(cycleTime) : ${
      //     cycleTime[0] ? cycleTime[1].diff(cycleTime[2], 'days') + 1 : null
      //   } 天

      //   每日比赛时间(${moment(dayBeginTime).format('kk:mm')}-${moment(dayEndTime).format(
      //   'kk:mm',
      // )})(dayEndTime - dayBeginTime) : ${dayEndTime ? dailyGameTime : null} 分

      //   按时开赛时间间隔(repeatInterval) : ${repeatInterval} 分

      //   比赛场数(gamePlayed) : ${gamePlayed} 场
      //   `);
    }
  }

  // 上传广告图
  handleChange = (info: any, key: string) => {
    if (info.file.status === 'uploading') {
      this.setState({ [`${key}Loading`]: true });
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, (imageUrl: string) =>
        this.setState({ isUpload: true, [key]: imageUrl }),
      );
    }
  };

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    this.onChangeFormValue();
    this.props.form.validateFieldsAndScroll((err: unknown, values: any) => {
      if (err) return;

      /** 格式化 奖励数组对象 */
      const rankRewardsJson: any = [];
      values.rewardFormKeys.map((it: any, i: number) => {
        rankRewardsJson.push({
          rank: [
            +values.rankingLeft.filter(it => it !== undefined)[i],
            +values.rankingRight.filter(it => it !== undefined)[i],
          ],
          reward: [
            {
              type: +values.rewardType.filter(it => it !== undefined)[i].split('*')[0],
              cardType: +values.rewardType.filter(it => it !== undefined)[i].split('*')[1],
              name: values.rewardType.filter(it => it !== undefined)[i].split('*')[2],

              itemName: values.rewardItem.filter(it => it !== undefined)[i].split('*')[0],
              itemid: +values.rewardItem.filter(it => it !== undefined)[i].split('*')[1],
              itemInfo: values.rewardItem.filter(it => it !== undefined)[i].split('*')[2],

              num: +values.rewardNumber.filter(it => it !== undefined)[i],
            },
          ],
        });
      });

      /** 格式化 机器人难度数据 */
      const extros = values.isRobot
        ? JSON.stringify({
            rates: [...values.extrosRates.map(it => parseInt(it))],
            pools: [...values.extrosPools],
          })
        : null;

      // 判断比赛奖励是否为空
      if (!rankRewardsJson[0]) {
        message.error('请添加比赛奖励');
        return;
      }
      // 判断添加比赛奖励是否异常 null
      if (!rankRewardsJson[0].rank[0] === null) {
        message.error('添加比赛奖励异常');
        return;
      }

      /** 格式化 报名费对象 */
      const registrationJson: object = {
        type: +values.applicationFeeType.split('*')[0],
        cardType: +values.applicationFeeType.split('*')[1],
        name: values.applicationFeeType.split('*')[2],

        itemName: values.applicationFeeItem.split('*')[0],
        itemid: +values.applicationFeeItem.split('*')[1],
        itemInfo: values.applicationFeeItem.split('*')[2],

        num: +values.applicationFeeNumber,
        level: +values.applicationFeeLevel,
      };

      easyDispatch(this, 'games/addLandlordsGMSMatch', {
        // 普通字符串数据
        ..._.pick(
          values,
          'competitionCharter',
          'competitionInstructions',
          'totalMatches',
          'name',
          'isRobot',
          'numberCompetitors',
          'type',
          'registrationFee',
          'registrationNote',
          'minPlayers',

          'firstPoint',
          'matchFirstPoint',
          'addPoint',
          'form',
          'maxNum',
          'riseNum',
          'addCount',
          'fusaiForm',
          'fusaiMaxNum',
          'fusaiRiseNum',
          'finalsTurn',
          'finalsFushu',
          'brands',
          // 'sonMatch'	,
          'fusaiAddCount',
        ),
        // 比赛类型：1冠名赛
        type: 1,
        // 推倒胡比赛类型
        gameName: 'tdh',
        // 将按时开赛时间间隔从 分钟 转换成 秒
        repeatInterval: values.repeatInterval * 60,
        players: 4,
        // 默认创建 B 级赛事
        tournamentLevel: 'B',
        // 二进制文件数据
        file:
          values!.file && values.file.fileList[0] ? values.file.fileList[0].originFileObj : null,
        // 广告图
        // oneLogo:
        //   values!.oneLogo && values.oneLogo.fileList[0] ? values.oneLogo.fileList[0].originFileObj : null,
        // twoLogo:
        //   values!.twoLogo && values.twoLogo.fileList[0] ? values.twoLogo.fileList[0].originFileObj : null,
        // threeLogo:
        //   values!.threeLogo && values.threeLogo.fileList[0] ? values.threeLogo.fileList[0].originFileObj : null,
        // fourLogo:
        //   values!.fourLogo && values.fourLogo.fileList[0] ? values.fourLogo.fileList[0].originFileObj : null,
        // fiveLogo:
        //   values!.fiveLogo && values.fiveLogo.fileList[0] ? values.fiveLogo.fileList[0].originFileObj : null,
        // 奖励机制 & 报名费机制
        rankRewardsJson: JSON.stringify(rankRewardsJson),
        registrationJson: JSON.stringify(registrationJson),
        // 机器人设置 JSON
        extros: values.isRobot ? extros.toString() : null,

        // 每日比赛开始-结束时间 '1594357838795'.slice(0,'1594357838795'.length-5)+'00000'
        dayBeginTime:
          moment(values.dayBeginTime)
            .format('x')
            .slice(0, moment(values.dayBeginTime).format('x').length - 4) + '0000',
        dayEndTime:
          moment(values.dayEndTime)
            .format('x')
            .slice(0, moment(values.dayBeginTime).format('x').length - 4) + '0000',
        // 比赛日期
        startTime: moment(values.cycleTime[0].format('YYYY-MM-DD 00:00:00')).format('x'),
        stopTime: moment(values.cycleTime[1].format('YYYY-MM-DD 23:59:59')).format('x'),

        // 回调方法处理事务
        onError: (code: any) => {
          message.error(code.msg);
          this.onError(code);
        },
        onOk: () => {
          message.success('申请比赛成功!');
          router.push(`/match/index?tab=${createLandlordsMatch}`);
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
    const { loadingaddLandlordsMatch, reward, organizerTree, brandType } = this.props;
    const {
      isUpload,
      error,
      formValues,
      oneLogo,
      twoLogo,
      threeLogo,
      fourLogo,
      fiveLogo,
      oneLogoLoading,
      twoLogoLoading,
      threeLogoLoading,
      fourLogoLoading,
      fiveLogoLoading,
    } = this.state;

    console.log(brandType);

    /**
     * 动态添加奖励组件
     */
    getFieldDecorator('rewardFormKeys', {
      initialValue: formValues.rankRewardsJson
        ? JSON.parse(formValues.rankRewardsJson).map((it, index) => index)
        : [],
    });
    const rewardFormKeys = getFieldValue('rewardFormKeys');
    const rewarItems = rewardFormKeys.map((k: number) => (
      <Form.Item label="奖励设定" required={false} key={k} style={{ marginBottom: 0 }}>
        <InputGroup style={{ width: '94%' }} compact>
          <Form.Item style={{ width: '12%', textAlign: 'center' }}>
            {getFieldDecorator(`rankingLeft[${k}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              rules: simpleRules('请输入名次!'),
            })(<Input style={{ width: '100%', textAlign: 'center' }} placeholder="数字" />)}
          </Form.Item>
          <Form.Item style={{ width: '5%', textAlign: 'center' }}>
            <Input
              style={{
                width: '100%',
                borderLeft: 0,
                pointerEvents: 'none',
                backgroundColor: '#fff',
              }}
              placeholder="~"
              disabled
            />
          </Form.Item>

          <Form.Item style={{ width: '12%', textAlign: 'center' }}>
            {getFieldDecorator(`rankingRight[${k}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              rules: simpleRules('请输名次!'),
            })(
              <Input
                style={{ width: '100%', textAlign: 'center', borderLeft: 0 }}
                placeholder="数字"
              />,
            )}
          </Form.Item>
          <Form.Item style={{ width: '20%', textAlign: 'center' }}>
            {getFieldDecorator(`rewardType[${k}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              rules: simpleRules('请选择奖励类型!'),
            })(
              <Select style={{ width: '100%' }} placeholder="请选择奖励类型">
                {reward
                  ? reward.map(
                      (it: {
                        id: string;
                        name: string;
                        cardType: number;
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
                      }) => {
                        const value = `${it.id}*${it.cardType}*${it.name}`;
                        return <Option value={value}>{it.name}</Option>;
                      },
                    )
                  : null}
              </Select>,
            )}
          </Form.Item>
          <Form.Item style={{ width: '25%', textAlign: 'center' }}>
            {getFieldDecorator(`rewardItem[${k}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              rules: simpleRules('请选择奖励物品!'),
            })(
              <Select style={{ width: '100%' }} placeholder="请选择奖励物品">
                {getFieldValue(`rewardType[${k}]`)
                  ? reward[getFieldValue(`rewardType[${k}]`).split('*')[0] - 1].lcMatchRewards.map(
                      it => {
                        const value = `${it.itemName}*${it.itemid}*${it.itemInfo}`;
                        return <Option value={value}>{it.itemName}</Option>;
                      },
                    )
                  : null}
              </Select>,
            )}
          </Form.Item>
          <Form.Item style={{ width: '25%', textAlign: 'center' }}>
            {getFieldDecorator(`rewardNumber[${k}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              rules: simpleRules('请输入奖励数量!'),
            })(<InputNumber style={{ width: '100%' }} placeholder="数量" />)}
          </Form.Item>
        </InputGroup>
        {rewardFormKeys.length > 1 ? (
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            onClick={this.removeDynamicForm.bind(this, k, 'rewardFormKeys')}
            style={{ position: 'absolute', top: '-9px', marginLeft: '4px' }}
          />
        ) : null}
      </Form.Item>
    ));

    /**
     * 动态添加机器人难度
     */
    getFieldDecorator('extrosFormKeys', {
      initialValue:
        formValues.extros && JSON.parse(formValues.extros)
          ? JSON.parse(formValues.extros).pools.map((it, index) => index)
          : [],
    });
    const extrosFormKeys = getFieldValue('extrosFormKeys');
    const extrosItems = extrosFormKeys.map((k: number) => (
      <Form.Item label="机器人难度配置" required={false} key={k} style={{ marginBottom: 0 }}>
        <InputGroup style={{ width: '94%' }} compact>
          <Form.Item style={{ width: '50%', textAlign: 'center' }}>
            {getFieldDecorator(`extrosPools[${k}]`, {
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
      <PageHeaderWrapper content={<div>未审核的比赛可以进行修改</div>}>
        <Form {...formLayout.formItemLayout} onSubmit={this.handleSubmit} layout="horizontal">
          <Card loading={false} style={{ padding: 14 }}>
            {error && <Alert message="错误" description={error} type="error" showIcon />}

            <Form.Item label="比赛名称">
              {getFieldDecorator('name', {
                rules: simpleRules('请输入比赛名称!'),
              })(<Input placeholder="请输入比赛名称" />)}
            </Form.Item>

            <Form.Item label="赛事场数">
              {getFieldDecorator('totalMatches', {
                rules: simpleRules('请输入申报总场数!'),
              })(
                <InputNumber
                  disabled={getFieldValue('type') === 1 ? true : false}
                  style={{ width: '100%' }}
                  min={0}
                  formatter={value => `${value}场`}
                  parser={value => value.replace('场', '')}
                />,
              )}
            </Form.Item>

            <Form.Item label="比赛类型">
              {getFieldDecorator('type', {
                initialValue: 1,
                rules: simpleRules('请选择赛事类型!'),
              })(
                <Select placeholder="请选择赛事类型" onChange={() => this.onChangeFormValue()}>
                  <Option value={1}>按时开赛</Option>
                  <Option disabled value={2}>
                    人满开赛
                  </Option>
                </Select>,
              )}
            </Form.Item>

            <Form.Item label="是否加入机器人">
              {getFieldDecorator('isRobot', {
                rules: simpleRules('请选择是否加入机器人!'),
              })(
                <Select placeholder="请选择是否加入机器人">
                  <Option value={0}>否</Option>
                  <Option value={1}>是</Option>
                </Select>,
              )}
            </Form.Item>

            <Form.Item label="最少真实参赛人数">
              {getFieldDecorator('minPlayers', {
                rules: simpleRules('请输入最少真实参赛人数!'),
              })(
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  placeholder="请输入最少真实参赛人数"
                />,
              )}
            </Form.Item>

            <Form.Item label="按时开赛时间间隔">
              {getFieldDecorator('repeatInterval', {
                rules: simpleRules('请输入按时开赛时间间隔!'),
              })(
                <InputNumber
                  disabled={getFieldValue('type') === 2 ? true : false}
                  min={0}
                  formatter={value => `${value}分`}
                  parser={value => value.replace('分', '')}
                  style={{ width: '100%' }}
                  onChange={v => this.onChangeFormValue()}
                />,
              )}
            </Form.Item>

            <Form.Item label="比赛可见范围" help="比赛可见范围不填写则是所有人可见">
              {getFieldDecorator('conferenceIds', {
                rules: [{ required: false, message: '请添加比赛可见范围' }],
              })(
                <Select
                  mode="tags"
                  size="default"
                  placeholder="请添加比赛可见范围"
                  style={{ width: '100%' }}
                >
                  {organizerTree
                    ? organizerTree.map(
                        (it: {
                          id: number;
                          name: string;
                          type: number;
                          clubNamesTVoList: { id: number; name: string; type: number };
                        }) => <Option key={it.id}>{it.name}</Option>,
                      )
                    : null}
                </Select>,
              )}
            </Form.Item>

            <Form.Item label="比赛日期">
              {getFieldDecorator('cycleTime', {
                // startTime stopTime
                rules: simpleRules('请选择比赛日期!'),
              })(
                <RangePicker
                  disabledDate={current => current && current < moment().subtract(1, 'days')}
                  showTime
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD"
                  onChange={v => this.onChangeFormValue()}
                />,
              )}
            </Form.Item>

            <Form.Item label="每日比赛开始-结束时间" style={{ marginBottom: 0 }}>
              <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
                {getFieldDecorator('dayBeginTime', {
                  rules:
                    getFieldValue('type') === 2
                      ? null
                      : [
                          {
                            validator: (rule, value, callback) => {
                              const dayEndTime = getFieldValue('dayEndTime');
                              if (!value) {
                                callback('请选择每日开始比赛时间！');
                              } else if (!moment(value).isBefore(dayEndTime)) {
                                callback('比赛开始时间必须提前于比赛结束时间');
                              } else {
                                callback();
                              }
                            },
                          },
                        ],
                })(
                  <TimePicker
                    format="HH:mm"
                    disabled={getFieldValue('type') === 2 ? true : false}
                    onChange={v => this.onChangeFormValue()}
                    style={{ width: '100%' }}
                  />,
                )}
              </Form.Item>
              <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>~</span>
              <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
                {getFieldDecorator('dayEndTime', {
                  rules:
                    getFieldValue('type') === 2
                      ? null
                      : [
                          {
                            validator: (rule, value, callback) => {
                              const dayBeginTime = getFieldValue('dayBeginTime');
                              if (!value) {
                                callback('请选择比赛结束时间！');
                              } else if (!moment(dayBeginTime).isBefore(value)) {
                                callback('比赛开始时间必须提前于比赛结束时间');
                              } else {
                                callback();
                              }
                            },
                          },
                        ],
                })(
                  <TimePicker
                    format="HH:mm"
                    disabled={getFieldValue('type') === 2 ? true : false}
                    onChange={v => this.onChangeFormValue()}
                    style={{ width: '100%' }}
                  />,
                )}
              </Form.Item>
            </Form.Item>

            <Form.Item label="单场报名费" style={{ marginBottom: 0 }}>
              <InputGroup style={{ width: '100%' }} compact>
                <Form.Item style={{ width: '30%', textAlign: 'center' }}>
                  {getFieldDecorator('applicationFeeType', {
                    validateTrigger: ['onChange', 'onBlur'],
                    rules: simpleRules('请选择报名费类型'),
                  })(
                    <Select style={{ width: '100%' }} placeholder="请选择报名费类型">
                      {reward[0]
                        ? reward
                            .filter((it: any) => it.id !== 3)
                            .map((it: any) => {
                              console.log(getFieldValue('applicationFeeType'));
                              const value = `${it.id}*${it.cardType}*${it.name}`;
                              return <Option key={value}>{it.name}</Option>;
                            })
                        : null}
                    </Select>,
                  )}
                </Form.Item>
                <Form.Item style={{ width: '30%', textAlign: 'center' }}>
                  {getFieldDecorator('applicationFeeItem', {
                    validateTrigger: ['onChange', 'onBlur'],
                    rules: simpleRules('请选择报名物品'),
                  })(
                    <Select style={{ width: '100%' }} placeholder="请选择报名物品">
                      {reward[0] && getFieldValue('applicationFeeType')
                        ? reward[
                            getFieldValue('applicationFeeType').split('*')[0] - 1
                          ].lcMatchRewards
                            .filter(it => it.id !== 3)
                            .map(it => {
                              const value = `${it.itemName}*${it.itemid}*${it.itemInfo}`;
                              return <Option value={value}>{it.itemName}</Option>;
                            })
                        : null}
                    </Select>,
                  )}
                </Form.Item>
                <Form.Item style={{ width: '25%', textAlign: 'center' }}>
                  {getFieldDecorator(`applicationFeeNumber`, {
                    validateTrigger: ['onChange', 'onBlur'],
                    rules: simpleRules('请填写报名需要数量'),
                  })(
                    <InputNumber
                      disabled={!getFieldValue('applicationFeeItem')}
                      style={{ width: '100%' }}
                      placeholder="数量"
                    />,
                  )}
                </Form.Item>
                <Form.Item style={{ width: '15%', textAlign: 'center' }}>
                  {getFieldDecorator(`applicationFeeLevel`, {
                    validateTrigger: ['onChange', 'onBlur'],
                    rules: simpleRules('请填写报名等级'),
                  })(<InputNumber style={{ width: '100%' }} placeholder="等级" />)}
                </Form.Item>
              </InputGroup>
            </Form.Item>

            <Form.Item label="最少开赛人数">
              {getFieldDecorator('numberCompetitors', {
                rules: simpleRules('请填写单场桌数!'),
              })(<InputNumber style={{ width: '100%' }} min={0} max={10000} />)}
            </Form.Item>

            {/* =============================================================================================================== */}
            <Form.Item label="初始积分">
              {getFieldDecorator('firstPoint', {
                rules: simpleRules('请输入初始积分!'),
              })(<InputNumber placeholder="请输入初始积分" style={{ width: '100%' }} />)}
            </Form.Item>

            <Form.Item label="初始底分">
              {getFieldDecorator('matchFirstPoint', {
                rules: simpleRules('请输入初始底分!'),
              })(<InputNumber placeholder="请输入初始底分" style={{ width: '100%' }} />)}
            </Form.Item>

            <Form.Item label="每轮底分增加值数">
              {getFieldDecorator('addPoint', {
                rules: simpleRules('请输入每轮底分增加值数!'),
              })(<InputNumber placeholder="请输入每轮底分增加值数" style={{ width: '100%' }} />)}
            </Form.Item>

            <Form.Item label="预赛形式">
              {getFieldDecorator('form', {
                initialValue: 0,
                rules: simpleRules('请选择预赛形式!'),
              })(
                <Select style={{ width: '100%' }} placeholder="请选择预赛形式">
                  <Option value={0}>打立出局</Option>
                  <Option disabled value={1}>
                    定局积分
                  </Option>
                  <Option disabled value={2}>
                    瑞士移位
                  </Option>
                </Select>,
              )}
            </Form.Item>

            <Form.Item label="预赛截止名次">
              {getFieldDecorator('maxNum', {
                rules: simpleRules('请输入预赛截止名次!'),
              })(<InputNumber placeholder="请输入预赛截止名次" style={{ width: '100%' }} />)}
            </Form.Item>

            <Form.Item label="预赛晋级名次">
              {getFieldDecorator('riseNum', {
                rules: simpleRules('请输入预赛晋级名次!'),
              })(<InputNumber placeholder="请输入预赛晋级名次" style={{ width: '100%' }} />)}
            </Form.Item>

            <Form.Item label="预赛加赛局数">
              {getFieldDecorator('addCount', {
                rules: simpleRules('请输入预赛加赛局数!'),
              })(<InputNumber placeholder="请输入预赛加赛局数" style={{ width: '100%' }} />)}
            </Form.Item>

            <Form.Item label="复赛形式">
              {getFieldDecorator('fusaiForm', {
                initialValue: 0,
                rules: simpleRules('请选择预赛形式!'),
              })(
                <Select style={{ width: '100%' }} placeholder="请选择预赛形式">
                  <Option value={0}>打立出局</Option>
                  <Option disabled value={1}>
                    定局积分
                  </Option>
                  <Option disabled value={2}>
                    瑞士移位
                  </Option>
                </Select>,
              )}
            </Form.Item>

            <Form.Item label="复赛截止名次">
              {getFieldDecorator('fusaiMaxNum', {
                rules: simpleRules('请输入复赛截止名次!'),
              })(<InputNumber placeholder="请输入复赛截止名次" style={{ width: '100%' }} />)}
            </Form.Item>

            <Form.Item label="复赛加赛局数">
              {getFieldDecorator('fusaiAddCount', {
                rules: simpleRules('请输入复赛加赛局数!'),
              })(<InputNumber placeholder="请输入复赛加赛局数" style={{ width: '100%' }} />)}
            </Form.Item>

            <Form.Item label="复赛晋级名次">
              {getFieldDecorator('fusaiRiseNum', {
                rules: simpleRules('请输入复赛晋级名次!'),
              })(<InputNumber placeholder="请输入复赛晋级名次" style={{ width: '100%' }} />)}
            </Form.Item>

            <Form.Item label="决赛轮次">
              {getFieldDecorator('finalsTurn', {
                rules: simpleRules('请输入决赛轮次!'),
              })(<InputNumber placeholder="请输入决赛轮次" style={{ width: '100%' }} />)}
            </Form.Item>

            <Form.Item label="决赛副数">
              {getFieldDecorator('finalsFushu', {
                rules: simpleRules('请输入决赛副数!'),
              })(<InputNumber placeholder="请输入决赛副数" style={{ width: '100%' }} />)}
            </Form.Item>

            <Form.Item label="冠名品牌">
              {getFieldDecorator('brands', {
                rules: simpleRules('请选择冠名品牌!'),
              })(
                <Select style={{ width: '100%' }} placeholder="请选择冠名品牌">
                  {brandType[0]
                    ? brandType.map(it => <Option key={it.id}>{it.name}</Option>)
                    : null}
                </Select>,
              )}
            </Form.Item>

            <div style={{ display: `${getFieldValue('isRobot') === 0 ? 'none' : 'block'}` }}>
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

            {rewarItems}
            <Form.Item
              {...formLayout.formItemLayoutWithOutLabel}
              extra={
                <>
                  <p style={{ padding: 0, margin: 0 }}>例如第 1 名依次输入：1，1，代币，钻石，2</p>
                  <p style={{ padding: 0, margin: 0 }}>
                    例如第 2~3 名依次输入：2，3，代币，钻石，2
                  </p>
                  <p style={{ padding: 0, margin: 0 }}>
                    注：奖励设定中排名不可超过
                    {getFieldValue('numberCompetitors')}
                  </p>
                </>
              }
            >
              <Button
                type="dashed"
                onClick={this.addDynamicForm.bind(this, 'rewardFormKeys')}
                style={{ width: '100%' }}
              >
                <Icon type="plus" /> 添加奖励
              </Button>
            </Form.Item>

            <Form.Item label="玩法" help="玩法不填写则使用系统设定内容">
              {getFieldDecorator('competitionCharter')(
                <TextArea placeholder="请输入玩法" rows={3} style={{ width: '100%' }} />,
              )}
            </Form.Item>

            <Form.Item label="赛制说明" help="赛制说明不填写则使用系统设定内容">
              {getFieldDecorator('competitionInstructions')(
                <TextArea placeholder="请输入赛制说明" rows={3} style={{ width: '100%' }} />,
              )}
            </Form.Item>

            <Form.Item label="比赛 logo" extra="如果不传的话，使用默认比赛 logo">
              {getFieldDecorator('file')(
                <Upload
                  name="logo"
                  accept="image/*"
                  listType="picture"
                  onRemove={() => {
                    this.setState({ isUpload: false });
                    this.props.form.setFieldsValue({ file: null }); // 比较奇怪这种方式清除的数据是 fileList
                  }}
                >
                  <Button onClick={() => this.setState({ isUpload: true })} disabled={isUpload}>
                    <Icon type="upload" /> 点击上传
                  </Button>
                </Upload>,
              )}
            </Form.Item>

            {/* <Form.Item label="广告图" extra="请选择5张广告图" style={{ marginBottom: 0 }}>
            <Form.Item style={{display:"inline-block", marginBottom: 0 }} >
              {getFieldDecorator('oneLogo')(
                <Upload
                  name="oneLogo"
                  accept="image/*"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  onChange={(info)=>this.handleChange(info,'oneLogo')}
                >
                  {oneLogo ? <img src={oneLogo} alt="oneLogo" style={{ width: '100%' }} /> : <UploadButton loading={oneLogoLoading} />}
                </Upload>
                )}
              </Form.Item>

              <Form.Item style={{display:"inline-block", marginBottom: 0 }}>
              {getFieldDecorator('twoLogo')(
                <Upload
                  name="twoLogo"
                  accept="image/*"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  onChange={(info)=>this.handleChange(info,'twoLogo')}
                >
                  {twoLogo ? <img src={twoLogo} alt="twoLogo" style={{ width: '100%' }} /> : <UploadButton loading={twoLogoLoading} />}
                </Upload>
                )}
              </Form.Item>

              <Form.Item style={{display:"inline-block", marginBottom: 0 }}>
              {getFieldDecorator('threeLogo')(
                <Upload
                  name="threeLogo"
                  accept="image/*"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  onChange={(info)=>this.handleChange(info,'threeLogo')}
                >
                  {threeLogo ? <img src={threeLogo} alt="threeLogo" style={{ width: '100%' }} /> : <UploadButton  loading={threeLogoLoading} />}
                </Upload>
                )}
              </Form.Item>

              <Form.Item style={{display:"inline-block", marginBottom: 0 }}>
              {getFieldDecorator('fourLogo')(
                <Upload
                  name="fourLogo"
                  accept="image/*"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  onChange={(info)=>this.handleChange(info,'fourLogo')}
                >
                  {fourLogo ? <img src={fourLogo} alt="fourLogo" style={{ width: '100%' }} /> : <UploadButton loading={fourLogoLoading} />}
                </Upload>
                )}
              </Form.Item>

              <Form.Item style={{display:"inline-block", marginBottom: 0 }}>
              {getFieldDecorator('fiveLogo')(
                <Upload
                  name="fiveLogo"
                  accept="image/*"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  onChange={(info)=>this.handleChange(info,'fiveLogo')}
                >
                  {fiveLogo ? <img src={fiveLogo} alt="fiveLogo" style={{ width: '100%' }} /> : <UploadButton  loading={fiveLogoLoading}  />}
                </Upload>
                )}
              </Form.Item>
            </Form.Item> */}

            <Form.Item {...formLayout.formItemLayoutWithOutLabel}>
              <Button loading={loadingaddLandlordsMatch} type="primary" htmlType="submit">
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
      </PageHeaderWrapper>
    );
  }
}

export default connect(
  ({
    games,
    organizer: { organizerTree },
    brand: { brandType },
    loading,
  }: {
    games: GameStateType;
    organizer: OrganizerStateType;
    brand: any;
    loading: {
      effects: {
        [key: string]: boolean;
      };
    };
    reward: any;
  }) => ({
    games,
    organizerTree,
    brandType,
    loadingaddLandlordsMatch: loading.effects['games/addLandlordsMatch'],
    reward: games.reward,
  }),
)(Form.create()(CreateLandlordsGMSMatch));

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

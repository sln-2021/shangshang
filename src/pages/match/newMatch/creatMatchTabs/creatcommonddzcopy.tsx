import React from 'react';
import {
  Card,
  Button,
  message,
  Form,
  Table,
  Input,
  Row,
  Col,
  Select,
  InputNumber,
} from 'antd';
import { fetchReward } from '@/services/games';
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 6 },
};

const { Option } = Select;
const InputGroup = Input.Group;

class CreateCommonDDZ extends React.Component {
  state = {
    feeData: [],
    feegoods: [],
    isDisabled: true,
  };
  componentDidMount() {
    this.initSelect();
  }
  async initSelect() {
    // 拿报名费接口数据
    const res = await fetchReward();
    this.setState({
      feeData: res.data,
    });
  }
  onFinish = (values: any) => {
    console.log(values, 'submitvalues');
  };
  onFinishFailed = () => {};
  handleType = (value: any) => {
    const typeId = value;
    const { feeData } = this.state;
    const fee: any = feeData.filter((item: any) => item.id == typeId);
    this.setState({
      feegoods: fee[0].lcMatchRewards,
      isDisabled: false,
    });
  };
  handlegoods = (value: any) => {
    console.log();
  };
  render() {
    const { feeData, feegoods, isDisabled } = this.state;
    return (
      <div>
        <Form
          {...layout}
          name="basic"
          initialValues={{ remember: true }}
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
        >
          <Form.Item
            label="名称"
            name="name"
            rules={[{ required: true, message: '请输入比赛名称!' }]}
          >
            <Input placeholder="请输入比赛名称" />
          </Form.Item>
          <Form.Item
            label="局数"
            name="games"
            rules={[{ required: true, message: '请输入比赛局数!' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              placeholder="请输入比赛局数"
            />
          </Form.Item>
          <Form.Item
            label="是否加入机器人"
            name="isRobot"
            rules={[{ required: true, message: '请选择是否加入机器人!' }]}
          >
            <Select placeholder="请选择是否加入机器人">
              <Option value={0}>否</Option>
              <Option value={1}>是</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="比赛类型"
            name="matchType"
            rules={[{ required: true, message: '请选择比赛类型!' }]}
          >
            <Select style={{ width: '100%' }} placeholder="请选择比赛类型">
              <Option value={1}>初级场</Option>
              <Option value={2}>中级场</Option>
              <Option value={3}>高级场</Option>
              <Option value={4}>大师场</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="底分"
            name="baseScore"
            rules={[{ required: true, message: '请输入底分!' }]}
          >
            <InputNumber
              placeholder="请输入底分"
              style={{ width: '100%' }}
              min={0}
            />
          </Form.Item>
          <Form.Item label="进入限制" style={{ marginBottom: 0 }}>
            <Form.Item
              style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}
              name="join_min"
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                placeholder="请输入加入对局所需最少金币"
              />
            </Form.Item>
            <span
              style={{
                display: 'inline-block',
                width: '24px',
                textAlign: 'center',
              }}
            >
              ~
            </span>
            <Form.Item
              help="如填写正无穷请输入 -1 "
              style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}
              name="join_max"
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="请输入加入对局所需最多金币"
              />
            </Form.Item>
          </Form.Item>
          <Form.Item label="单场报名费">
            <InputGroup style={{ width: '100%' }} compact>
              <Form.Item name="cost_type" style={{ width: '34%' }}>
                <Select
                  placeholder="请输入单场报名费类型"
                  style={{ width: '100%' }}
                  onChange={this.handleType}
                >
                  {feeData.map((feeType: any) => (
                    <Option key={feeType.id} value={feeType.id}>
                      {feeType.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="cost_id" style={{ width: '34%' }}>
                <Select
                  placeholder="请输入报名物品"
                  style={{ width: '100%' }}
                  onChange={this.handlegoods}
                >
                  {feegoods.map((good: any) => (
                    <Option key={good.id} value={good.id}>
                      {good.itemName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="cost_n" style={{ width: '32%' }}>
                <InputNumber
                  disabled={isDisabled}
                  style={{ width: '100%' }}
                  placeholder="数量"
                />
              </Form.Item>
            </InputGroup>
          </Form.Item>
          <Form.Item label="单个最高奖励设定">
            <InputGroup style={{ width: '100%' }} compact>
              <Form.Item name=" reward">
                <Select
                  placeholder="请输入奖励类型"
                  style={{ width: '34%' }}
                  onChange={this.handleType}
                >
                  {feeData.map((feeType: any) => (
                    <Option key={feeType.id} value={feeType.id}>
                      {feeType.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Select
                placeholder="请输入奖励物品"
                style={{ width: '34%' }}
                onChange={this.handlegoods}
              >
                {feegoods.map((good: any) => (
                  <Option key={good.id} value={good.id}>
                    {good.itemName}
                  </Option>
                ))}
              </Select>
              <InputNumber style={{ width: '32%' }} placeholder="数量" />
            </InputGroup>
          </Form.Item>

          <Form.Item label="两个最高奖励设定">
            <InputGroup style={{ width: '100%' }} compact>
              <Select
                placeholder="请输入奖励类型"
                style={{ width: '34%' }}
                onChange={this.handleType}
              >
                {feeData.map((feeType: any) => (
                  <Option key={feeType.id} value={feeType.id}>
                    {feeType.name}
                  </Option>
                ))}
              </Select>
              <Select
                placeholder="请输入奖励物品"
                style={{ width: '34%' }}
                onChange={this.handlegoods}
              >
                {feegoods.map((good: any) => (
                  <Option key={good.id} value={good.id}>
                    {good.itemName}
                  </Option>
                ))}
              </Select>
              <InputNumber style={{ width: '32%' }} placeholder="数量" />
            </InputGroup>
          </Form.Item>
          <Form.Item label="三个最高奖励设定">
            <InputGroup style={{ width: '100%' }} compact>
              <Select
                placeholder="请输入奖励类型"
                style={{ width: '34%' }}
                onChange={this.handleType}
              >
                {feeData.map((feeType: any) => (
                  <Option key={feeType.id} value={feeType.id}>
                    {feeType.name}
                  </Option>
                ))}
              </Select>
              <Select
                placeholder="请输入奖励物品"
                style={{ width: '34%' }}
                onChange={this.handlegoods}
              >
                {feegoods.map((good: any) => (
                  <Option key={good.id} value={good.id}>
                    {good.itemName}
                  </Option>
                ))}
              </Select>
              <InputNumber style={{ width: '32%' }} placeholder="数量" />
            </InputGroup>
          </Form.Item>
          <Form.Item label="机器人难度设置"></Form.Item>
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}
export default CreateCommonDDZ;

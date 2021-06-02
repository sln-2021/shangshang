import { Icon } from '@ant-design/compatible';
import { Form } from '@ant-design/compatible';
import React, { Fragment } from 'react';
import { Row, Col,  Alert, Input,  Select, Button, InputNumber, message } from 'antd';
import FormSubmitModal from '../../../components/BaseComponents/FormSubmitModal';
import { validateImage } from '../../../common/validator';
import { color } from '../../../common/color';
import { connect } from 'umi';
import { easyDispatch, easyRouteTo } from '@/utils/easyDispatch';

const { Option } = Select;

const simpleRules = msg => [
    {
        required: true,
        message: msg,
    },
];

export default class ChangeBillModal extends React.PureComponent {
    state = {
        error: '',
    };

    render() {
        const { info, onOk, onShowAsync, reward, error, children } = this.props;

        const data = reward.length > 0 ? reward.filter(it => it.cardType === 1) : [];

        return (
            <FormSubmitModal
                title="修改话费内容"
                formClassName="settingPopupForm"
                onShowAsync={onShowAsync}
                onOk={onOk}
                formProvider={form => {
                    const { getFieldDecorator, getFieldValue, setFieldsValue } = form;
                    // 给表单填值

                    //   if (info) {
                    //     setFieldsValue({
                    //       rewardType: parseInt(info.rewardType),
                    //       rewardItem: info.itemid,
                    //       worth: info.worth,
                    //       amount: info.amount,
                    //       num: info.num,
                    //       showWeigt: info.showWeigt,
                    //     });
                    //   }

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
                                        <Alert type="error" showIcon message="添加出错" description={error} />
                                    </Col>
                                </Row>
                            ) : null}

                            <Row gutter={8}>
                                <Col span={24}> 分类 </Col>
                                <Col span={24}>
                                    <Form.Item>
                                        {getFieldDecorator(`rewardType`, {
                                            rules: simpleRules('请选择商城兑换类型!'),
                                            initialValue: info.rewardType,
                                        })(
                                            <Select style={{ width: '100%' }} placeholder="请选择商城兑换类型">
                                                {data.length > 0
                                                    ? data.map(it => {
                                                        return <Option key={it.id}>{it.name}</Option>;
                                                    })
                                                    : null}
                                            </Select>,
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={8}>
                                <Col span={24}> 物品 </Col>
                                <Col span={24}>
                                    <Form.Item>
                                        {getFieldDecorator(`rewardItem`, {
                                            rules: simpleRules('请选择商城兑换物品!'),
                                            initialValue: String(info.itemName),
                                        })(
                                            <Select style={{ width: '100%' }} placeholder="请选择商城兑换物品">
                                                {getFieldValue(`rewardType`) && data.length > 0
                                                    ? data
                                                        .filter(it => {
                                                            const itemid = getFieldValue(`rewardType`);
                                                            return it.id === itemid || 1;
                                                        })[0]
                                                        .lcMatchRewards.map(it => {
                                                            return <Option key={it.itemid}>{it.itemName}</Option>;
                                                        })
                                                    : null}
                                            </Select>,
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={8}>
                                <Col span={24}> 商品价值 </Col>
                                <Col span={24}>
                                    <Form.Item>
                                        {form.getFieldDecorator('worth', {
                                            initialValue: parseInt(info.worth),
                                        })(
                                            <Input
                                                style={{
                                                    width: '100%',
                                                }}
                                                placeholder="请填入商品价值"
                                            />,
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={8}>
                                <Col span={24}> 支付金额 </Col>
                                <Col span={24}>
                                    <Form.Item>
                                        {form.getFieldDecorator('amount', {
                                            initialValue: parseInt(info.amount),
                                        })(
                                            <Input
                                                style={{
                                                    width: '100%',
                                                }}
                                                placeholder="请填入支付金额"
                                            />,
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={8}>
                                <Col span={24}> 券数量 </Col>
                                <Col span={24}>
                                    <Form.Item>
                                        {form.getFieldDecorator('num', { initialValue: parseInt(info.num) })(
                                            <InputNumber
                                                style={{
                                                    width: '100%',
                                                }}
                                                placeholder="请填入券数量"
                                            />,
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={8}>
                                <Col span={24}> 权重 </Col>
                                <Col span={24}>
                                    <Form.Item>
                                        {form.getFieldDecorator('showWeigt', {
                                            initialValue: parseInt(info.showWeigt),
                                        })(
                                            <InputNumber
                                                style={{
                                                    width: '100%',
                                                }}
                                                placeholder="请填入权重"
                                            />,
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

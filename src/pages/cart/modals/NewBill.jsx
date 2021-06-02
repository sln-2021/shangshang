import { Icon } from '@ant-design/compatible';
import { Form } from '@ant-design/compatible';
import React, { Fragment } from 'react';
import { Row, Col,  Alert, Input,  Select, Button, InputNumber, message } from 'antd';
import FormSubmitModal from '../../../components/BaseComponents/FormSubmitModal';
import { validateImage } from '../../../common/validator';
import { connect } from 'umi';
import { easyDispatch, easyRouteTo } from '@/utils/easyDispatch';

const { Option } = Select;

const simpleRules = msg => [
    {
        required: true,
        message: msg,
    },
];

export default class NewBill extends React.PureComponent {
    state = {
        error: '',
    };

    render() {
        const { BillList, onOk, onShowAsync, reward, error } = this.props;

        const data = reward.length > 0 ? reward.filter(it => it.cardType === 1) : [];

        return (
            <FormSubmitModal
                title="添加话费内容"
                formClassName="settingPopupForm"
                onShowAsync={onShowAsync}
                onOk={onOk}
                formProvider={form => {
                    this.form = form;
                    const { getFieldDecorator, getFieldValue } = form;
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
                                        })(
                                            <Select style={{ width: '100%' }} placeholder="请选择商城兑换类型">
                                                {data.length > 0
                                                    ? data.map(it => {
                                                        return <Option value={it.id}>{it.name}</Option>;
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
                                        })(
                                            <Select style={{ width: '100%' }} placeholder="请选择商城兑换物品">
                                                {getFieldValue(`rewardType`)
                                                    ? data
                                                        .filter(it => it.id === getFieldValue(`rewardType`))[0]
                                                        .lcMatchRewards.map(it => {
                                                            return <Option value={it.id}>{it.itemName}</Option>;
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
                                        {form.getFieldDecorator(
                                            'worth',
                                            {},
                                        )(
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
                                        {form.getFieldDecorator(
                                            'amount',
                                            {},
                                        )(
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
                                        {form.getFieldDecorator(
                                            'num',
                                            {},
                                        )(
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
                                        {form.getFieldDecorator(
                                            'showWeigt',
                                            {},
                                        )(
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
                <Button icon="rocket" type="primary">
                    添加话费内容
        </Button>
            </FormSubmitModal>
        );
    }
}

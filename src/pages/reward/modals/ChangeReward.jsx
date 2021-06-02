import { Icon } from '@ant-design/compatible';
import { Form } from '@ant-design/compatible';
import React, { Fragment } from 'react';
import { Row, Col,  Alert, Input, Upload,  Select } from 'antd';
import FormSubmitModal from '../../../components/BaseComponents/FormSubmitModal';
import { validateImage } from '../../../common/validator';

const { TextArea } = Input;
const { Option } = Select
const { Dragger } = Upload;
const simpleRules = message => [{ required: true, message }];
/**
 * @augments {React.PureComponent<{
    onOk: (values: any, callback: Function) => any;
    onShowAsync?: Function;
    data?: any
    error: any;
  }, {}>}
 */
export default class ChangeReward extends React.PureComponent {
  state = {
    isUpload: false,
    imageUrl: '',
  };


  handleChange = info => {
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, imageUrl => this.setState({ isUpload: true, imageUrl }));
    }
  };

  render() {
    const { data, error, onOk, onShowAsync, children } = this.props;
    const { isUpload, imageUrl } = this.state;
    const { cardType, icon, id, itemInfo, itemName, itemid, isSelf } = data


    return (
      <FormSubmitModal
        title="修改奖励物品"
        formClassName="settingPopupForm"
        onOk={onOk}
        onShowAsync={() => {
          onShowAsync();
          this.setState({ isUpload: false, imageUrl: '' }) // 初始化上传图片
        }}
        formProvider={form => (
          <Fragment>
            {error ? (
              <Alert
                type="error"
                showIcon
                message="操作失败"
                description={error}
                style={{ marginBottom: 10 }}
              />
            ) : null}
            <Row gutter={8} style={{ display: (cardType === -1 ? 'none' : '') }}>
              <Col span={24}>
                <Form.Item label="奖品ID" help="注：填写ID请先去查询商品ID确认无误后再填写">
                  {form.getFieldDecorator('itemid', {
                    initialValue: itemid,
                    rules: [{ required: cardType === -1 ? false : true, message: "请输入奖品ID!" }],
                  })(<Input style={{ width: '100%' }} placeholder="请输入奖品ID" />)}
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={8}>
              <Col span={24}>
                <Form.Item label="奖品名称">
                  {form.getFieldDecorator('itemName', {
                    initialValue: itemName,
                    rules: simpleRules('请输入奖品名称!'),
                  })(<Input style={{ width: '100%' }} placeholder="请输入奖品名称" />)}
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={8}>
              <Col span={24}>
                <Form.Item label="兑换商品信息">
                  {form.getFieldDecorator('itemInfo', {
                    initialValue: itemInfo,
                    rules: simpleRules('请输入兑换商品信息!'),
                  })(<TextArea
                    autoSize={{ minRows: 3, maxRows: 5 }}
                    style={{ width: '100%' }}
                    placeholder="请输入兑换商品信息"
                  />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={24}>请选择是否自提</Col>
              <Col span={24}>
                <Form.Item>
                  {form.getFieldDecorator('isSelf', {
                    initialValue: isSelf,
                    rules: simpleRules('请输入是否自提!')
                  })(
                    <Select style={{ width: '100%' }} >
                      <Option value={0}>否</Option>
                      <Option value={1}>是</Option>
                    </Select>
                  )}

                </Form.Item>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={24}>图标文件</Col>
              <Col span={24}>
                <Form.Item>
                  {form.getFieldDecorator('file', {
                    rules: [{ validator: validateImage }],
                  })(
                    <Dragger
                      accept="image/*"
                      listType="picture"
                      onRemove={() => {
                        this.setState({ isUpload: false });
                        form.setFieldsValue({ file: null }); // 比较奇怪这种方式清除的数据是 fileList
                      }}
                      onChange={this.handleChange}
                      disabled={isUpload}
                      showUploadList={false}
                    >
                      {imageUrl ? (
                        <img src={imageUrl} alt="预览图片" style={{ width: '100%' }} />
                      ) : (
                          <>
                            <p className="ant-upload-drag-icon">
                              <Icon type="inbox" />
                            </p>
                            <p className="ant-upload-text">单击或拖动文件到此区域上传</p>
                            <p className="ant-upload-hint">请上传图片格式的文件！</p>
                          </>
                        )}
                    </Dragger>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Fragment>
        )}
      >
        {children}
      </FormSubmitModal>
    );
  }
}

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

import { Icon } from '@ant-design/compatible';
import { Form } from '@ant-design/compatible';
import React, { Fragment } from "react";
import { Row, Col,  Button, InputNumber, Alert, Upload,  message } from "antd";
import FormSubmitModal from '../../../components/BaseComponents/FormSubmitModal';

const { Dragger } = Upload;
const simpleRules = (message) => ([{ required: true, message }]);
/**
 * @augments {React.PureComponent<{
    onOk: (values: any, callback: Function) => any;
    onShowAsync?: Function
    error: any;
  }, {}>}
 */
export default class NewBonus extends React.PureComponent {
  state = {
    isUpload: false,
    imageUrl: '',
  };

  fileVerification = (rule, value, callback) => {
    const { file } = value
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isJpgOrPng) {
      callback('您只能上传JPG/PNG文件!');
    } else if (!isLt2M) {
      callback('图像必须小于2MB!');
    } else if (!value) {
      callback('请上传文件!');
    } else {
      callback();
    }
  };

  handleChange = info => {
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({ isUpload: true, imageUrl }),
      );
    }
  };


  render() {
    const { error, onOk, onShowAsync } = this.props;
    const { isUpload, imageUrl } = this.state;

    return (
      <FormSubmitModal
        title="添加兑换券池"
        formClassName="settingPopupForm"
        onShowAsync={onShowAsync}
        onOk={onOk}
        onShow={
          () => this.setState({ imageUrl: '', isUpload: false, })
        }
        formProvider={form => (
          <Fragment>
            {error ? (
              <Row gutter={8} style={{ marginBottom: 10 }}>
                <Col span={24}>
                  <Alert type="error" showIcon message="添加出错" description={error} />
                </Col>
              </Row>
            ) : null}
            <Row gutter={8}>
              <Col span={24}>缴纳金额</Col>
              <Col span={24}>
                <Form.Item>
                  {form.getFieldDecorator("bonusTotal", {
                    rules: simpleRules('请填入缴纳金额!'),
                  })(
                    <InputNumber
                      formatter={value => `${value}元`}
                      parser={value => value.replace('元', '')}
                      style={{ width: '100%' }}
                      placeholder="请填入缴纳金额"
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={8}>
              <Col span={24}>流水单文件</Col>
              <Col span={24}>
                <Form.Item >
                  {form.getFieldDecorator('file', {
                    rules: [
                      {
                        validator: this.fileVerification,
                      },
                    ],
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
                      {
                        imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : <>
                          <p className="ant-upload-drag-icon">
                            <Icon type="inbox" />
                          </p>
                          <p className="ant-upload-text">单击或拖动文件到此区域上传</p>
                          <p className="ant-upload-hint">
                            请上传图片格式的文件！
                          </p>
                        </>
                      }
                    </Dragger>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Fragment>
        )} >
        <Button icon="bulb" type="primary">添加兑换券池</Button>
      </FormSubmitModal>
    );
  }
}

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}
import { Icon } from '@ant-design/compatible';
import { Form } from '@ant-design/compatible';
import React, { Fragment } from 'react';
import { Row, Col,  Alert, Input, Upload } from 'antd';
import FormSubmitModal from '../../../components/BaseComponents/FormSubmitModal';

const { Dragger } = Upload;
const simpleRules = message => [{ required: true, message }];
/**
 * @augments {React.PureComponent<{
    onOk: (values: any, callback: Function) => any;
    onShowAsync?: Function;
    error: any;
    info: any;
  }, {}>}
 */
export default class ChangeSponsorUser extends React.PureComponent {
  state = {
    isUpload: false,
  };

  render() {
    const { error, onOk, onShowAsync, children, info } = this.props;
    const { isUpload } = this.state;

    return (
      <FormSubmitModal
        title="更新主办方"
        formClassName="settingPopupForm"
        onOk={onOk}
        onShowAsync={onShowAsync}
        formProvider={form => (
          <Fragment>
            {error ? (
              <Row gutter={8} style={{ marginBottom: 10 }}>
                <Col span={24}>
                  <Alert
                    type="error"
                    showIcon
                    message="操作失败"
                    description={error}
                    style={{ marginBottom: 10 }}
                  />
                </Col>
              </Row>
            ) : null}
            <Row gutter={8}>
              <Col span={24}>名称</Col>
              <Col span={24}>
                <Form.Item>
                  {form.getFieldDecorator('name', {
                    initialValue: info.name,
                    rules: simpleRules('请填入渠道名称!'),
                  })(<Input style={{ width: '100%' }} placeholder="请填入渠道名称" />)}
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={8}>
              <Col span={24}>logo</Col>
              <Col span={24}>
                <Form.Item>
                  {form.getFieldDecorator(
                    'logoFile',
                    {},
                  )(
                    <Dragger
                      accept="image/*"
                      listType="picture"
                      onRemove={() => {
                        this.setState({ isUpload: false });
                        form.setFieldsValue({ file: null }); // 比较奇怪这种方式清除的数据是 fileList
                      }}
                      onChange={() => this.setState({ isUpload: true })}
                      disabled={isUpload}
                    >
                      <p className="ant-upload-drag-icon">
                        <Icon type="inbox" />
                      </p>
                      <p className="ant-upload-text">单击或拖动文件到此区域上传</p>
                      <p className="ant-upload-hint">请上传图片格式的文件！</p>
                    </Dragger>,
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

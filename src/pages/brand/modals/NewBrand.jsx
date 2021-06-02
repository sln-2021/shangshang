import { Icon } from '@ant-design/compatible';
import { Form } from '@ant-design/compatible';
import React, { Fragment } from 'react';
import { Row, Col,  Alert, Input, Upload } from 'antd';
import FormSubmitModal from '../../../components/BaseComponents/FormSubmitModal';
import { validateImage } from '../../../common/validator';

const { Dragger } = Upload;
const simpleRules = message => [{ required: true, message }];
/**
 * @augments {React.PureComponent<{
    onOk: (values: any, callback: Function) => any;
    onShowAsync?: Function;
    error: any;
  }, {}>}
 */
export default class NewBrand extends React.PureComponent {
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
    const { error, onOk, onShowAsync, children } = this.props;
    const { isUpload, imageUrl } = this.state;

    return (
      <FormSubmitModal
        title="创建子比赛类目"
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
            <Row gutter={8}>
              <Col span={24}>
                <Form.Item label="子比赛名称">
                  {form.getFieldDecorator('name', {
                    rules: simpleRules('请输入子比赛名称!'),
                  })(<Input style={{ width: '100%' }} placeholder="请输入子比赛名称" />)}
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

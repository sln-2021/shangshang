import { Icon } from '@ant-design/compatible';
import { Form } from '@ant-design/compatible';
import React, { Fragment } from 'react';
import { Row, Col,  Button, Input, Alert, Upload } from 'antd';
import FormSubmitModal from '../../../components/BaseComponents/FormSubmitModal';
import { validateImage } from '../../../common/validator';

const simpleRules = message => [{ required: true, message }];
/**
 * @augments {React.PureComponent<{
    onOk: (values: any, callback: Function) => any;
    onShowAsync?: Function
    error: any;
  }, {}>}
 */
export default class NewBrandType extends React.PureComponent {

  state = {
    file: '',
    oneLogo: "",
    twoLogo: "",
    threeLogo: "",
    fourLogo: "",
    fiveLogo: "",
    fileLoading: false,
    oneLogoLoading: false,
    twoLogoLoading: false,
    threeLogoLoading: false,
    fourLogoLoading: false,
    fiveLogoLoading: false
  };



  render() {
    const { error, onOk, onShowAsync } = this.props;
    const {
      file, oneLogo, twoLogo, threeLogo, fourLogo, fiveLogo,
      fileLoading, oneLogoLoading, twoLogoLoading, threeLogoLoading, fourLogoLoading, fiveLogoLoading
    } = this.state;

    return (
      <FormSubmitModal
        title="添加冠名品牌"
        formClassName="settingPopupForm"
        onShowAsync={onShowAsync}
        onOk={onOk}
        formProvider={form => {
          const { getFieldDecorator } = form
          // 上传广告图
          const handleChange = (info, key) => {
            if (info.file.status === 'uploading') {
              this.setState({ [`${key}Loading`]: true });
              return;
            }
            if (info.file.status === 'done') {
              getBase64(info.file.originFileObj, (imageUrl) => this.setState({ [key]: imageUrl }));
            }
          };
          return <Fragment>
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
              <Col span={24}>品牌名称</Col>
              <Col span={24}>
                <Form.Item>
                  {form.getFieldDecorator('name', {
                    rules: simpleRules('请填入品牌名称!'),
                  })(<Input placeholder="请填入品牌名称" />)}
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={8}>
              <Col span={24}>图标</Col>
              <Col span={24}>
                <Form.Item >
                  {getFieldDecorator('file', {
                    rules: simpleRules('请上传图标文件!'),
                  })(
                    <Upload
                      name="oneLogo"
                      accept="image/*"
                      listType="picture-card"
                      className="avatar-uploader"
                      showUploadList={false}
                      onChange={(info) => handleChange(info, 'file')}
                    >
                      {file ? <img src={file} alt="file" style={{ width: '100%' }} /> : <UploadButton loading={fileLoading} />}
                    </Upload>
                  )}
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={8}>
              <Col span={24}>奖励类型</Col>
              <Col span={24}>
                <Form.Item extra="请最多选择5张广告图">
                  <Form.Item style={{ display: "inline-block", marginBottom: 0 }}>
                    {getFieldDecorator('oneLogo')(
                      <Upload
                        name="oneLogo"
                        accept="image/*"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        onChange={(info) => handleChange(info, 'oneLogo')}
                      >
                        {oneLogo ? <img src={oneLogo} alt="oneLogo" style={{ width: '100%' }} /> : <UploadButton loading={oneLogoLoading} />}
                      </Upload>
                    )}
                  </Form.Item>

                  <Form.Item style={{ display: "inline-block", marginBottom: 0 }}>
                    {getFieldDecorator('twoLogo')(
                      <Upload
                        name="twoLogo"
                        accept="image/*"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        onChange={(info) => handleChange(info, 'twoLogo')}
                      >
                        {twoLogo ? <img src={twoLogo} alt="twoLogo" style={{ width: '100%' }} /> : <UploadButton loading={twoLogoLoading} />}
                      </Upload>
                    )}
                  </Form.Item>

                  <Form.Item style={{ display: "inline-block", marginBottom: 0 }}>
                    {getFieldDecorator('threeLogo')(
                      <Upload
                        name="threeLogo"
                        accept="image/*"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        onChange={(info) => handleChange(info, 'threeLogo')}
                      >
                        {threeLogo ? <img src={threeLogo} alt="threeLogo" style={{ width: '100%' }} /> : <UploadButton loading={threeLogoLoading} />}
                      </Upload>
                    )}
                  </Form.Item>

                  <Form.Item style={{ display: "inline-block", marginBottom: 0 }}>
                    {getFieldDecorator('fourLogo')(
                      <Upload
                        name="fourLogo"
                        accept="image/*"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        onChange={(info) => handleChange(info, 'fourLogo')}
                      >
                        {fourLogo ? <img src={fourLogo} alt="fourLogo" style={{ width: '100%' }} /> : <UploadButton loading={fourLogoLoading} />}
                      </Upload>
                    )}
                  </Form.Item>

                  <Form.Item style={{ display: "inline-block", marginBottom: 0 }}>
                    {getFieldDecorator('fiveLogo')(
                      <Upload
                        name="fiveLogo"
                        accept="image/*"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        onChange={(info) => handleChange(info, 'fiveLogo')}
                      >
                        {fiveLogo ? <img src={fiveLogo} alt="fiveLogo" style={{ width: '100%' }} /> : <UploadButton loading={fiveLogoLoading} />}
                      </Upload>
                    )}
                  </Form.Item>
                </Form.Item>
              </Col>
            </Row>
          </Fragment>

        }

        }
      >
        <Button icon="pull-request" type="primary">
          添加冠名品牌
        </Button>
      </FormSubmitModal>
    );
  }
}

const UploadButton = props => {
  const { loading } = props
  return (
    <div>
      <Icon type={loading ? 'loading' : 'plus'} />
      <div className="ant-upload-text">上传</div>
    </div>
  )
};

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

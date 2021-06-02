import { Icon } from '@ant-design/compatible';
import { Form } from '@ant-design/compatible';
// @ts-check
import _ from 'lodash';
import React from 'react';
import {  Button, Row, Col, Input, Card, Upload } from 'antd';
import Pictures from '../../../components/Pictures/index'

/**
 * @augments {React.PureComponent<{
    loading: boolean;
    details: any;
    onChangBasicInfo: (values: any) => void;

    form?: any;
  }, {}>}
 */

// @ts-ignore
@Form.create()
export default class OtherInfoCard extends React.PureComponent {
  state = {
    isBusinessLicenseButton: false,
    isCorporateFileButton: false,
    isCorporateFanFileButton: false,
  };

  onClearIsUpload() {
    this.setState({
      isBusinessLicenseButton: false,
      isCorporateFileButton: false,
      isCorporateFanFileButton: false,
    })
  }

  onChangBasicInfo(event) {
    event.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) return;
      if (Object.values(values).every(o => o === undefined)) return;
      const param = {
        businessLicenseFile: values.businessLicenseFile && values.businessLicenseFile.fileList[0] ? values.businessLicenseFile.fileList[0].originFileObj : null,
        corporateFile: values.corporateFile && values.corporateFile.fileList[0] ? values.corporateFile.fileList[0].originFileObj : null,
        corporateFanFile: values.corporateFanFile && values.corporateFanFile.fileList[0] ? values.corporateFanFile.fileList[0].originFileObj : null,
      }
      this.onClearIsUpload();
      this.props.onChangBasicInfo(param);
    });
  }

  render() {
    const { loading, details, form } = this.props;
    const { isBusinessLicenseButton, isCorporateFileButton, isCorporateFanFileButton } = this.state;

    return (
      <Form layout="vertical" hideRequiredMark onSubmit={this.onChangBasicInfo.bind(this)}>
        <Card title="资质文件" bordered={false} loading={loading} style={{ marginBottom: 24 }}
          extra={
            <Button icon="save" type="primary" size="small" htmlType="submit">
              保存变更
            </Button>
          }>
          <Row gutter={16} style={{ marginTop: '24px' }}>
            <Col lg={6} md={12} sm={24}>
              <Row>
                <Pictures
                  pictureURL={details.businessLicenseUrl}
                  Placeholder='businessLicense'
                  title={`${details.name}的营业执照`} hideRemark />
              </Row>
              <Row >
                <Form.Item extra="点此上传营业执照">
                  {form.getFieldDecorator('businessLicenseFile', {})(
                    <Upload name="logo" accept="image/*"
                      listType="picture"
                      onRemove={() => {
                        this.setState({ isBusinessLicenseButton: false });
                        this.props.form.setFieldsValue({ businessLicenseFile: null }); // 比较奇怪这种方式清除的数据是 fileList
                      }}
                    >
                      <Button
                        style={{ width: 250 }}
                        onClick={() => this.setState({ isBusinessLicenseButton: true })}
                        disabled={isBusinessLicenseButton}
                      >
                        <Icon type="upload" /> 点击上传
                      </Button>
                    </Upload>
                  )}
                </Form.Item>
              </Row>
            </Col>
            <Col lg={6} md={12} sm={24}>
              <Row>
                <Pictures
                  pictureURL={details.corporateUrl}
                  Placeholder='IDPicturesFront'
                  title={`${details.name}的身份证正面`} hideRemark />
              </Row>
              <Row>
                <Form.Item extra="点此上传法人证件正面照">
                  {form.getFieldDecorator('corporateFile', {})(
                    <Upload name="logo" accept="image/*"
                      listType="picture"
                      onRemove={() => {
                        this.setState({ isCorporateFileButton: false });
                        this.props.form.setFieldsValue({ corporateFile: null }); // 比较奇怪这种方式清除的数据是 fileList
                      }}
                    >
                      <Button
                        style={{ width: 250 }}
                        onClick={() => this.setState({ isCorporateFileButton: true })}
                        disabled={isCorporateFileButton}
                      >
                        <Icon type="upload" /> 点击上传
                      </Button>
                    </Upload>
                  )}
                </Form.Item>
              </Row>
            </Col>
            <Col lg={6} md={12} sm={24}>
              <Row>
                <Pictures
                  pictureURL={details.corporateFanUrl}
                  Placeholder='IDPicturesReverse'
                  title={`${details.name}的身份证反面`} hideRemark />
              </Row>
              <Row>
                <Form.Item extra="点此上传法人证件反面照">
                  {form.getFieldDecorator('corporateFanFile', {})(
                    <Upload name="logo" accept="image/*"
                      listType="picture"
                      onRemove={() => {
                        this.setState({ isCorporateFanFileButton: false });
                        this.props.form.setFieldsValue({ corporateFanFile: null }); // 比较奇怪这种方式清除的数据是 fileList
                      }}
                    >
                      <Button
                        style={{ width: 250 }}
                        onClick={() => this.setState({ isCorporateFanFileButton: true })}
                        disabled={isCorporateFanFileButton}
                      >
                        <Icon type="upload" /> 点击上传
                      </Button>
                    </Upload>
                  )}
                </Form.Item>
              </Row>
            </Col>
          </Row>
        </Card>
      </Form>
    );
  }
}

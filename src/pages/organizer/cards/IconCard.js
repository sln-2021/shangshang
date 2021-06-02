import { Icon } from '@ant-design/compatible';
import { Form } from '@ant-design/compatible';
//@ts-check

import React from 'react';
import {  Button, Row, Col, Upload, Card } from 'antd';
import AvatarIcon from "../../../components/AvatarIcon";

/**
 * @augments {React.PureComponent<{
    loading: boolean;
    details: any;
    uploadIcon: (formData: FormData) => any;


    form?: any;
  }, {}>}
 */
// @ts-ignore
@Form.create()
export default class IconCard extends React.PureComponent {
  state = {
    isUpload: false
  };

  onChangBasicInfo(event) {
    event.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) return;
      if (Object.values(values).every(o => o === undefined)) return;
      const param = {
        logoFile: values.logoFile && values.logoFile.fileList[0] ? values.logoFile.fileList[0].originFileObj : null,
      }
      this.setState({ isUpload: false })
      this.props.onChangBasicInfo(param);
    });
  }

  render() {
    const { loading, form, details } = this.props;
    const { isUpload } = this.state;

    return (
      <Form layout="vertical" hideRequiredMark onSubmit={this.onChangBasicInfo.bind(this)}>
        <Card title="图标" bordered={false} loading={loading} style={{ marginBottom: 24 }}
          extra={
            <Button icon="save" type="primary" size="small" htmlType="submit">
              保存变更
            </Button>
          }>
          <Row gutter={16} style={{ marginTop: 24 }}>
            <Col span={12}>
              <AvatarIcon size={54} iconURL={details.logoUrl} name={details.name} />
            </Col>
            <Col lg={12} md={12} >
              <Form.Item>
                {form.getFieldDecorator('logoFile', {})(
                  <Upload name="logo" accept="image/*"
                    listType="picture"
                    onRemove={() => {
                      this.setState({ isUpload: false });
                      this.props.form.setFieldsValue({ logoFile: null }); // 比较奇怪这种方式清除的数据是 fileList
                    }}
                  >
                    <Button
                      onClick={() => this.setState({ isUpload: true })}
                      disabled={isUpload}
                    >
                      <Icon type="upload" /> 点击上传
                      </Button>
                  </Upload>
                )}
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Form>
    );
  }
}

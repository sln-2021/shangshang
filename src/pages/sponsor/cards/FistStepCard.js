import { Icon } from '@ant-design/compatible';
import { Form } from '@ant-design/compatible';
// @ts-check
import _ from 'lodash';
import React, { Fragment } from 'react';
import {  Button, Input,  Upload, Divider } from 'antd';
import styles from './style.less';

const { Dragger } = Upload;

/**
 * @augments {React.PureComponent<{
    loading: boolean;
    details: any;
    onFistStep: (values: any) => void;
    form?: any;
  }, {}>}
 */

// @ts-ignore
@Form.create()
export default class FistStepCard extends React.PureComponent {
  state = {
    isUpload: false,
  };

  onFistStep(event) {
    event.preventDefault();
    // @ts-ignore
    this.props.form.validateFields((err, values) => {
      if (err) return;
      const param = {
        name: values.name,
        logoFile: values.logoFile && values.logoFile.fileList[0] ? values.logoFile.fileList[0].originFileObj : null,
      }
      this.props.onFistStep(param);
    });
  }

  render() {
    const simpleRules = (message) => ([{ required: true, message }]);
    const IconFont = Icon.createFromIconfontCN({ scriptUrl: '//at.alicdn.com/t/font_1625968_d6hvs7qs18.js' });
    const { loading, form } = this.props;
    const { isUpload } = this.state;
    const formItemLayout = { labelCol: { span: 5 }, wrapperCol: { span: 19 } };

    return (
      <Fragment>
        <Form layout="horizontal" className={styles.stepForm} hideRequiredMark onSubmit={this.onFistStep.bind(this)}>
          <Form.Item {...formItemLayout} label="主办方名称">
            {form.getFieldDecorator('name', {
              rules: simpleRules('请填写主办方名称！'),
            })(
              <Input
                prefix={<IconFont type="icon-zhihangmingcheng" />}
                placeholder="请填写主办方名称"
                style={{ width: '100%' }} />
            )}
          </Form.Item>

          <Form.Item {...formItemLayout} label="logo文件">
            {form.getFieldDecorator('logoFile', {
              rules: [{ required: false, message: '请选择' }],
            })(
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
              </Dragger>
            )}
          </Form.Item>
          <Form.Item
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: {
                span: formItemLayout.wrapperCol.span,
                offset: formItemLayout.labelCol.span,
              },
            }}
            label=""
          >
            <Button loading={loading} type="primary" htmlType="submit">
              下一步
            </Button>
          </Form.Item>
        </Form>
        <Divider style={{ margin: '40px 0 24px' }} />
        <div className={styles.desc}>
          <h3>说明</h3>
          <h4>添加主办方比较特殊必须按步骤进行且不能中途关闭页面或者逆向添加</h4>
          <p>
            第一步先填写主办方信息然后点击下一步会自动获取到主办方 ID 并自动填写到第二步操作当中
          </p>
        </div>
      </Fragment >
    );
  }
}

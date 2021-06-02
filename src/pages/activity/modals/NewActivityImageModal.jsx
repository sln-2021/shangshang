import { Icon } from '@ant-design/compatible';
import { Form } from '@ant-design/compatible';
import React, { Fragment } from 'react';
import {
  Row,
  Col,
  
  Button,
  Input,
  Alert,
  
  Select,
  TreeSelect,
  Upload,
  DatePicker,
} from 'antd';
import FormSubmitModal from '../../../components/BaseComponents/FormSubmitModal';
import { validateImage } from '../../../common/validator';

const { RangePicker } = DatePicker;
const { Dragger } = Upload;
const { Option } = Select;
const { TreeNode } = TreeSelect;
const simpleRules = msg => [{ required: true, message: msg }];
const ALL_VISIBLE = [{ id: -1, name: '全部渠道', type: 1 }];
/**
 * @augments {React.PureComponent<{
    onOk: (values: any, callback: Function) => any;
    onShowAsync?: Function
    error: any;
    organizerTree: any;
  }, {}>}
 */
export default class NewActivityImageModal extends React.PureComponent {
  state = {
    isIconfileUpload: false,
    isImgfileUpload: false,
    iconfileUrl: '',
    imgfileUrl: '',
  };

  handleChange = (info, type) => {
    switch (type) {
      case 'iconfile':
        getBase64(info.file.originFileObj, iconfileUrl =>
          this.setState({ isIconfileUpload: true, iconfileUrl }),
        );
        break;
      case 'imgfile':
        getBase64(info.file.originFileObj, imgfileUrl =>
          this.setState({ isImgfileUpload: true, imgfileUrl }),
        );
        break;
      default:
        break;
    }
  };

  render() {
    const { organizerTree, error, onOk, onShowAsync } = this.props;
    const { isIconfileUpload, isImgfileUpload, iconfileUrl, imgfileUrl } = this.state;

    return (
      <FormSubmitModal
        title="添加图片活动"
        formClassName="settingPopupForm"
        onShowAsync={onShowAsync}
        onOk={onOk}
        formProvider={form => {
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
                    <Alert type="error" showIcon message="发送出错" description={error} />
                  </Col>
                </Row>
              ) : null}
              <Row gutter={8}>
                <Col span={24}> 标题 </Col>
                <Col span={24}>
                  <Form.Item>
                    {form.getFieldDecorator('title', {
                      rules: simpleRules('请输入标题!'),
                    })(
                      <Input
                        style={{
                          width: '100%',
                        }}
                        placeholder="请输入标题"
                      />,
                    )}
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={8}>
                <Col span={24}> 时间范围 </Col>
                <Col span={24}>
                  <Form.Item>
                    {form.getFieldDecorator('timeInterval', {
                      rules: simpleRules('请选择时间范围!'),
                    })(<RangePicker showTime style={{ width: '100%' }} format="YYYY-MM-DD" />)}
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={8}>
                <Col span={24}> 类型 </Col>
                <Col span={24}>
                  <Form.Item>
                    {form.getFieldDecorator('type', {
                      initialValue: 1,
                      rules: simpleRules('请选择类型!'),
                    })(
                      <Select style={{ width: '100%' }} placeholder="请选择类型">
                        <Option value={1}>公告</Option>
                        <Option value={2}>活动</Option>
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={8}>
                <Col span={24}> 排序权重 </Col>
                <Col span={24}>
                  <Form.Item help="数字越大排序越靠前">
                    {form.getFieldDecorator('orderId', {
                      rules: simpleRules('请输入排序权重!'),
                    })(
                      <Input
                        style={{
                          width: '100%',
                        }}
                        placeholder="请输入排序权重"
                        type="number"
                      />,
                    )}
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={8}>
                <Col span={24}> 可见范围 </Col>
                <Col span={24}>
                  <Form.Item>
                    {form.getFieldDecorator('conference', {
                      initialValue: -1,
                      rules: simpleRules('请选择可见范围!'),
                    })(
                      <TreeSelect
                        style={{
                          width: '100%',
                        }}
                        dropdownStyle={{
                          maxHeight: 400,
                          overflow: 'auto',
                        }}
                        placeholder="请选择可见范围"
                        allowClear
                      >
                        {ALL_VISIBLE.concat(organizerTree).map(it => (
                          <TreeNode value={it.id} title={it.name} key={it.id} />
                        ))}
                      </TreeSelect>,
                    )}
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={8}>
                <Col span={12}> 图标文件 </Col>
                <Col span={12}> 内容图片文件 </Col>
                <Col span={12}>
                  <Form.Item>
                    {form.getFieldDecorator('iconfile', {
                      rules: [{ validator: validateImage }],
                    })(
                      <Dragger
                        accept="image/*"
                        listType="picture"
                        onRemove={() => {
                          this.setState({ isIconfileUpload: false });
                          form.setFieldsValue({ iconfile: null }); // 比较奇怪这种方式清除的数据是 fileList
                        }}
                        onChange={v => this.handleChange(v, 'iconfile')}
                        disabled={isIconfileUpload}
                        showUploadList={false}
                      >
                        {iconfileUrl ? (
                          <img src={iconfileUrl} alt="avatar" style={{ width: '100%' }} />
                        ) : (
                            <>
                              <p className="ant-upload-drag-icon">
                                <Icon type="inbox" />
                              </p>
                              <p className="ant-upload-text">单击或拖动文件到此区域上传</p>
                              <p className="ant-upload-hint">请上传图片格式的文件！</p>
                            </>
                          )}
                      </Dragger>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item>
                    {form.getFieldDecorator('imgfile', {
                      rules: [{ validator: validateImage }],
                    })(
                      <Dragger
                        accept="image/*"
                        listType="picture"
                        onRemove={() => {
                          this.setState({ isImgfileUpload: false });
                          form.setFieldsValue({ imgfile: null }); // 比较奇怪这种方式清除的数据是 fileList
                        }}
                        onChange={v => this.handleChange(v, 'imgfile')}
                        disabled={isImgfileUpload}
                        showUploadList={false}
                      >
                        {imgfileUrl ? (
                          <img src={imgfileUrl} alt="avatar" style={{ width: '100%' }} />
                        ) : (
                            <>
                              <p className="ant-upload-drag-icon">
                                <Icon type="inbox" />
                              </p>
                              <p className="ant-upload-text">单击或拖动文件到此区域上传</p>
                              <p className="ant-upload-hint">请上传图片格式的文件！</p>
                            </>
                          )}
                      </Dragger>,
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Fragment>
          );
        }}
      >
        <Button icon="rocket" type="primary">
          添加图片活动
        </Button>
      </FormSubmitModal>
    );
  }
}

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

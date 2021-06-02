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
export default class NewAdvertisingModal extends React.PureComponent {
  state = {
    isfileUpload: false,
    isImgfileUpload: false,
    iconfileUrl: '',
    imgfileUrl: '',
  };

  handleChange = (info, type) => {
    switch (type) {
      case 'file':
        getBase64(info.file.originFileObj, iconfileUrl =>
          this.setState({ isfileUpload: true, iconfileUrl }),
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
    const { isfileUpload, isImgfileUpload, iconfileUrl, imgfileUrl } = this.state;

    return (
      <FormSubmitModal
        title="添加广告"
        formClassName="settingPopupForm"
        onShowAsync={onShowAsync}
        onOk={onOk}
        formProvider={form => {
          return (
            <Fragment>
              {error ? (
                <Row
                  gutter={8}
                  style={{ marginBottom: 10 }}
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
                    {form.getFieldDecorator('name', {
                      rules: simpleRules('请输入标题!'),
                    })(
                      <Input
                        style={{ width: '100%' }}
                        placeholder="请输入标题"
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={8}>
                <Col span={24}> 序号 </Col>
                <Col span={24}>
                  <Form.Item>
                    {form.getFieldDecorator('serialNum', {
                      rules: simpleRules('请输入序号!'),
                    })(
                      <Input
                        style={{ width: '100%' }}
                        placeholder="请输入序号"
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={8}>
                <Col span={24}> 位置 </Col>
                <Col span={24}>
                  <Form.Item>
                    {form.getFieldDecorator('location', {
                      rules: simpleRules('请输入位置!'),
                    })(
                      <Select
                        mode="multiple"
                        style={{ width: '100%' }}
                        placeholder="请输入位置用‘，’隔开"
                      >
                        <Option key="A">登录</Option>
                        <Option key="B">普通场</Option>
                        <Option key="C">好友场</Option>
                        <Option key="D">比赛场</Option>
                      </Select>
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
                <Col span={24}> 广告图片 </Col>
                <Col span={24}>
                  <Form.Item>
                    {form.getFieldDecorator('file', {
                      rules: [{ validator: validateImage }],
                    })(
                      <Dragger
                        accept="image/*"
                        listType="picture"
                        onRemove={() => {
                          this.setState({ isfileUpload: false });
                          form.setFieldsValue({ file: null }); // 比较奇怪这种方式清除的数据是 fileList
                        }}
                        onChange={v => this.handleChange(v, 'file')}
                        // disabled={isfileUpload}
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
              </Row>
            </Fragment>
          );
        }}
      >
        <Button icon="rocket" type="primary">
          添加广告
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

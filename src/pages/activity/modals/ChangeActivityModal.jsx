import { Icon } from '@ant-design/compatible';
import { Form } from '@ant-design/compatible';
import React, { Fragment } from 'react';
import moment from 'moment';
import { Row, Col,  Input, Alert,  Select, TreeSelect, Upload, DatePicker } from 'antd';
import FormSubmitModal from '../../../components/BaseComponents/FormSubmitModal';

const { RangePicker } = DatePicker;
const { Dragger } = Upload;
const { Option } = Select;
const { TextArea } = Input;
const { TreeNode } = TreeSelect;
const simpleRules = msg => [{ required: true, message: msg }];
const ALL_VISIBLE = [{ id: -1, name: '全部渠道', type: 1 }];

/**
 * @augments {React.PureComponent<{
    onOk: (values: any, callback: Function) => any;
    onShowAsync?: Function;
    info: any;
    organizerTree: any;
    error: any;
  }, {}>}
 */
export default class ChangeActivityModal extends React.PureComponent {
  state = {
    isIconfileUpload: false,
    isImgfileUpload: false,
    iconfileUrl: '',
    imgfileUrl: '',
  };

  fileVerification = (rule, value, callback) => {
    const { file } = value;
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

  initState() {
    this.setState({
      isIconfileUpload: false,
      isImgfileUpload: false,
      iconfileUrl: '',
      imgfileUrl: '',
    });
  }

  render() {
    const { organizerTree, info, error, onOk, children, onShowAsync } = this.props;
    const { isIconfileUpload, isImgfileUpload, iconfileUrl, imgfileUrl } = this.state;
    const isImage = info.iconurl || info.imgurl;
    const isText = !!info.content;

    return (
      <FormSubmitModal
        title="修改活动"
        formClassName="settingPopupForm"
        onOk={onOk}
        onShowAsync={() => {
          onShowAsync();
          this.initState();
        }}
        formProvider={form => (
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
                    initialValue: info.title,
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
            <Row gutter={8} style={isText ? {} : { display: 'none' }}>
              <Col span={24}> 文字内容 </Col>
              <Col span={24}>
                <Form.Item>
                  {form.getFieldDecorator('content', {
                    initialValue: info.content,
                  })(
                    <TextArea
                      rows={4}
                      style={{
                        width: '100%',
                      }}
                      placeholder="请输入文字内容"
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
                    initialValue: [moment(info.begintime), moment(info.endtime)],
                    rules: simpleRules('请选择时间范围!'),
                  })(
                    <RangePicker
                      showTime
                      style={{
                        width: '100%',
                      }}
                      format="YYYY-MM-DD"
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={24}> 类型 </Col>
              <Col span={24}>
                <Form.Item>
                  {form.getFieldDecorator('type', {
                    initialValue: info.type,
                    rules: simpleRules('请选择类型!'),
                  })(
                    <Select
                      style={{
                        width: '100%',
                      }}
                      placeholder="请选择类型"
                    >
                      <Option value={1}> 公告 </Option>
                      <Option value={2}> 活动 </Option>
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
                    initialValue: info.orderId,
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
                    initialValue: info.conference,
                    rules: [
                      {
                        required: false,
                        message: '请选择可见范围',
                      },
                    ],
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
            <Row gutter={8} style={isImage ? {} : { display: 'none' }}>
              <Col span={12}> 图标文件 </Col> <Col span={12}> 内容图片文件 </Col>
              <Col span={12}>
                <Form.Item>
                  {form.getFieldDecorator('iconfile', {
                    rules: [{ required: false }],
                  })(
                    <Dragger
                      accept="image/*"
                      listType="picture"
                      onRemove={() => {
                        this.setState({
                          isIconfileUpload: false,
                        });
                        form.setFieldsValue({
                          iconfile: null,
                        }); // 比较奇怪这种方式清除的数据是 fileList
                      }}
                      onChange={v => this.handleChange(v, 'iconfile')}
                      disabled={isIconfileUpload}
                      showUploadList={false}
                    >
                      {iconfileUrl ? (
                        <img
                          src={iconfileUrl}
                          alt="avatar"
                          style={{
                            width: '100%',
                          }}
                        />
                      ) : (
                          <>
                            <p className="ant-upload-drag-icon">
                              <Icon type="inbox" />
                            </p>
                            <p className="ant-upload-text"> 单击或拖动文件到此区域上传 </p>
                            <p className="ant-upload-hint"> 请上传图片格式的文件！ </p>
                          </>
                        )}
                    </Dragger>,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item>
                  {form.getFieldDecorator('imgfile', {
                    rules: [
                      {
                        required: false,
                        message: '请选择可见范围',
                      },
                    ],
                  })(
                    <Dragger
                      accept="image/*"
                      listType="picture"
                      onRemove={() => {
                        this.setState({
                          isImgfileUpload: false,
                        });
                        form.setFieldsValue({
                          imgfile: null,
                        }); // 比较奇怪这种方式清除的数据是 fileList
                      }}
                      onChange={v => this.handleChange(v, 'imgfile')}
                      disabled={isImgfileUpload}
                      showUploadList={false}
                    >
                      {imgfileUrl ? (
                        <img
                          src={imgfileUrl}
                          alt="avatar"
                          style={{
                            width: '100%',
                          }}
                        />
                      ) : (
                          <>
                            <p className="ant-upload-drag-icon">
                              <Icon type="inbox" />
                            </p>
                            <p className="ant-upload-text"> 单击或拖动文件到此区域上传 </p>
                            <p className="ant-upload-hint"> 请上传图片格式的文件！ </p>
                          </>
                        )}
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

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

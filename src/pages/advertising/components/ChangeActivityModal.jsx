import { Icon } from '@ant-design/compatible';
import { Form } from '@ant-design/compatible';
import React, { Fragment } from 'react';
import moment from 'moment';
import { Row, Col,  Input, Alert,  Select, TreeSelect, Upload, DatePicker, InputNumber } from 'antd';
import FormSubmitModal from '../../../components/BaseComponents/FormSubmitModal';
import { validateImage } from '../../../common/validator';

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
    brandList: any;
  }, {}>}
 */
export default class ChangeActivityModal extends React.PureComponent {
  state = {
    isIconfileUpload: false,
    isImgfileUpload: false,
    iconfileUrl: '',
    imgfileUrl: '',
  };

  handleChange = (info, type) => {
    switch (type) {
      case 'file':
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
    const { organizerTree, info, error, onOk, brandList, children, onShowAsync } = this.props;
    const { isIconfileUpload, isImgfileUpload, iconfileUrl, imgfileUrl } = this.state;
    const isImage = info.iconurl || info.imgurl;

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
                  {form.getFieldDecorator('name', {
                    rules: simpleRules('请输入标题!'),
                    initialValue: info.name,
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
              <Col span={24}> 品牌 </Col>
              <Col span={24}>
                <Form.Item>
                  {form.getFieldDecorator('brandId', {
                    rules: simpleRules('请选择品牌!'),
                    initialValue: info.brandId,
                  })(
                    <Select style={{ width: '100%' }}  >
                      {brandList.map((it) => <Option value={it.id}>{it.name}</Option>)}
                    </Select>
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
                    initialValue: info.serialNum,
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
                    initialValue: info.location.split(','),
                  })(
                    <Select
                      mode="multiple"
                      style={{ width: '100%' }}
                      placeholder="请输入位置用‘，’隔开"
                    >
                      <Option value="A">登录</Option>
                      <Option value="B">普通场</Option>
                      <Option value="C">好友场</Option>
                      <Option value="D">比赛场</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={8}>
              <Col span={24}> 播放次数 </Col>
              <Col span={24}>
                <Form.Item>
                  {form.getFieldDecorator('allCount', {
                    rules: simpleRules('请输入播放次数!'),
                    initialValue: info.allCount
                  })(
                    <InputNumber
                      style={{ width: '100%' }}
                      placeholder="请输入播放次数"
                      min={0}
                    />
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
                    initialValue: [moment(info.begintime), moment(info.endtime)],
                  })(<RangePicker showTime style={{ width: '100%' }} format="YYYY-MM-DD" />)}
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={8}>
              <Col span={24}> 可见范围 </Col>
              <Col span={24}>
                <Form.Item>
                  {form.getFieldDecorator('conference', {
                    rules: simpleRules('请选择可见范围!'),
                    initialValue: info.conference,
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
                        this.setState({ isIconfileUpload: false });
                        form.setFieldsValue({ file: null }); // 比较奇怪这种方式清除的数据是 fileList
                      }}
                      onChange={v => this.handleChange(v, 'file')}
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

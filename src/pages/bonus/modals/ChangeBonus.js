import { Icon } from '@ant-design/compatible';
import { Form } from '@ant-design/compatible';
import React, {
  Fragment
} from "react";
import {
  Row,
  Col,
  
  Alert,
  
  Select,
  InputNumber,
  Upload
} from "antd";
import FormSubmitModal from '../../../components/BaseComponents/FormSubmitModal';
import {
  color
} from "../../../common/color";

const {
  Option
} = Select;
const {
  Dragger
} = Upload;
const simpleRules = (message) => ([{
  required: true,
  message
}]);
/**
 * @augments {React.PureComponent<{
    onOk: (values: any, callback: Function) => any;
    onShowAsync?: Function;
    onSelect?: Function;
    error: any;
    info: any;
  }, {}>}
 */
export default class ChangeBonus extends React.PureComponent {
  state = {
    isUpload: false,
  };

  render() {
    const {
      error,
      onOk,
      onShowAsync,
      onSelect,
      children,
      info
    } = this.props;
    const {
      isUpload
    } = this.state;

    return ( <
      FormSubmitModal title = "修改兑换券池"
      formClassName = "settingPopupForm"
      onOk = {
        onOk
      }
      onShowAsync = {
        onShowAsync
      }
      onSelect = {
        onSelect
      } // 提交完成后刷新数据
      formProvider = {
        form => ( <
          Fragment > {
            error ? ( <
              Alert type = "error"
              showIcon message = "操作失败"
              description = {
                error
              }
              style = {
                {
                  marginBottom: 10
                }
              }
              />
            ) : null
          } <
          Row gutter = {
            8
          } >
          <
          Col span = {
            24
          } > 缴纳金额 < /Col> <
          Col span = {
            24
          } >
          <
          Form.Item > {
            form.getFieldDecorator("bonusTotal", {
              initialValue: info.bonusTotal,
              rules: simpleRules('请填入缴纳金额!'),
            })( <
              InputNumber formatter = {
                value => `${value}元`
              }
              parser = {
                value => value.replace('元', '')
              }
              style = {
                {
                  width: '100%'
                }
              }
              placeholder = "请填入缴纳金额" /
              >
            )
          } <
          /Form.Item> <
          /Col> <
          /Row> {
            /* 
                        <Row gutter={8}>
                          <Col span={24}>流水单文件</Col>
                          <Col span={24}>
                            <Form.Item >
                              {form.getFieldDecorator('file', {
                                rules: simpleRules('请上传流水单文件!'),
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
                                  <p className="ant-upload-hint">
                                    请上传图片格式的文件！
                                  </p>
                                </Dragger>
                              )}
                            </Form.Item>
                          </Col>
                        </Row> */
          } <
          /Fragment>
        )
      } > {
        children
      } <
      /FormSubmitModal>
    );
  }
}

import { Icon } from '@ant-design/compatible';
import { Form } from '@ant-design/compatible';
import React, { Fragment } from "react";
import { Input, Row, Col,  Button, Alert, Select } from "antd";
import FormSubmitModal from '../../../components/BaseComponents/FormSubmitModal';
// import InputPhone from '../../../components/BaseComponents/InputPhone';

const Option = Select.Option;
const simpleRules = (message) => ([{ required: true, message }]);
/**
 * @augments {React.PureComponent<{
    organizerSelect: any;
    onShowAsync?: Function;
    onOk: (values: any, callback: Function) => any;
    error: any;
  }, {}>}
 */
export default class OnbindOrganizerToPponsor extends React.PureComponent {

  render() {
    const { error, onOk, organizerSelect, onShowAsync, children } = this.props;
    // 渲染页面时 先去后端请求下拉列表的值 处理一下
    const list = organizerSelect || [];
    const select = [];
    for (let i = 0; i < list.length; i++) {
      select.push(<Option key={list[i].id ? list[i].id : ''}>{list[i].name ? list[i].name : ''}</Option>);
    }


    return (
      <FormSubmitModal
        title="改绑到其他主办方"
        formClassName="settingPopupForm"
        onShowAsync={onShowAsync}
        onOk={onOk}
        formProvider={form => (
          <Fragment>
            {error ? (
              <Row gutter={8} style={{ marginBottom: 10 }}>
                <Col span={24}>
                  <Alert type="error" showIcon message="改绑出错" description={error} />
                </Col>
              </Row>
            ) : null}
            <Row gutter={8}>
              <Col span={24}>请选择主办方</Col>
              <Col span={24}>
                <Form.Item>
                  {form.getFieldDecorator('leagueId', {
                    rules: simpleRules('请选择主办方'),
                  })(
                    <Select style={{ width: '100%' }} placeholder="请选择主办方">
                      {select}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>

          </Fragment>
        )} >
        {children}
      </FormSubmitModal>
    );
  }
}

// @ts-check
// <reference path="../../../types.d.ts" />

import React from 'react';
import { Modal } from 'antd';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';

/**
 * @augments {React.Component<{
    onOk: (values: {[key: string]: any}, callback: Function) => any;
    title: string;
    maskClosable?: boolean;
    width?: number;
    formProvider: (form: { getFieldDecorator: Function; [other: string]: any; }) => any;
    formClassName?: string;
    form?: any;
    onShow?: Function;
    onShowAsync?: Function;
    onSelect?: Function;
  }, {}>}
 */
// @ts-ignore

@Form.create()
export default class FormSubmitModal extends React.Component {
  state = {
    visible: false,
    loading: false,
  };

  showModelHandler = (e) => {
    if (e) e.stopPropagation();
    const { form, onShow, onShowAsync } = this.props;
    if (onShow) onShow();
    else if (onShowAsync) setTimeout(() => onShowAsync(), 15);

    form.resetFields();
    this.setState({
      visible: true,
    });
  };

  hideModelHandler = () => {
    this.setState({
      visible: false,
    });
  };

  okHandler = () => {
    const { onOk, onSelect } = this.props;
    const callback = (close = true) => {
      this.setState({
        loading: false,
      });
      if (close) setTimeout(this.hideModelHandler.bind(this), 15);
    };
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          loading: true,
        });
        onOk(values, callback);
        if (onSelect) setTimeout(() => onSelect(), 1500);
      }
    });
  };

  render() {
    const { visible } = this.state;
    const {
      children,
      form,
      title,
      formProvider,
      formClassName,
      width,
      maskClosable,
    } = this.props;

    return (
      <span>
        <span onClick={this.showModelHandler}> {children} </span>
        <Modal
          title={title}
          width={width}
          maskClosable={maskClosable}
          visible={this.state.visible}
          onOk={this.okHandler.bind(this)}
          onCancel={this.hideModelHandler}
          confirmLoading={this.state.loading}
        >
          <Form className={formClassName}>
            {' '}
            {visible ? formProvider(form) : null}{' '}
          </Form>
        </Modal>
      </span>
    );
  }
}

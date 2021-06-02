//@ts-check
/// <reference path="../../../types.d.ts" />

import React from 'react';
import { Modal } from 'antd';

/**
 * @augments {React.Component<{
    width: number;
    height: number;
    popupWidth: number;
    src: string;
    alt: string;
  }, {}>}
 */
//@ts-ignore
export default class ImagePreviewModal extends React.Component {
  state = {
    visible: false,
  };

  showModelHandler = e => {
    if (e) e.stopPropagation();
    this.setState({
      visible: true,
    });
  };

  hideModelHandler = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { popupWidth, width, height, src, alt } = this.props;

    return (
      <span>
        <span onClick={this.showModelHandler}>
          <img style={{ width, height }} src={src} alt={alt} />
        </span>
        <Modal
          title={alt}
          width={popupWidth}
          onCancel={this.hideModelHandler.bind(this)}
          style={{ top: 20, textAlign: 'center'}}
          footer={null}
          visible={this.state.visible}>
          <img style={{ maxWidth: '100%' }} src={src} alt={alt} />
        </Modal>
      </span>
    );
  }
}

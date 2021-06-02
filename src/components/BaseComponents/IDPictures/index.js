//@ts-check
/// <reference path="../../../types.d.ts" />

/*
  身分验证 图片 预览组件(上传成功了的图片预览)
*/

import React, { Fragment } from 'react';
import { Modal } from 'antd';
import { debugEcho } from '../../../utils/debug';
import styles from './index.less';

const imgPlaceholder = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D';

/**
 * @augments {React.PureComponent<{
    files: ({title: string; url: string})[];
    hideRemark?: boolean;
    popupWidth?: number;
  }, {}>}
 */
export default class IDPictures extends React.PureComponent {
  smallImage = null;
  bigImage = null;
  lazyTimer = null;

  state = {
    visible: false,
  };

  showModelHandler = e => {
    if (e) e.stopPropagation();
    if (this.bigImage && this.smallImage)
      this.bigImage.src = this.smallImage.src;

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
    const { files, popupWidth, hideRemark } = this.props;

    return (
      <div className={styles.idImageWrapper}>
        {files.map(file => (
          <Fragment key={file.url} >
            <div className={files.length > 1 ? styles.idImageBox : styles.idImageBoxFixedWidth}
              onClick={this.showModelHandler} >
              <div className={styles.idImagePreview}>
                <img alt={file.title} width="100%"
                  src={file.url}
                  //src={imgPlaceholder}
                  ref={image => {
                    this.smallImage = image;
                    if (!image) return;
                    // lazyTimer 避免请求多次
                    if (this.lazyTimer)
                      clearTimeout(this.lazyTimer);
                    this.lazyTimer = setTimeout(() => {
                      this.lazyTimer = null;
                      debugEcho(`Request image: ${file.url}`);
                    }, 250);
                  }}
                />
              </div>
              {hideRemark ? null : (
                <div>
                  <span className={styles.idImageSmall}>{file.title}</span>
                </div>
              )}
            </div>
            <Modal
              title={file.title}
              width={popupWidth || 720}
              centered={true}
              onCancel={this.hideModelHandler.bind(this)}
              style={{ top: 20, textAlign: 'center' }}
              footer={null}
              visible={this.state.visible}>
              <img style={{ maxWidth: '100%' }} ref={element => {
                this.bigImage = element;
                if (this.smallImage)
                  element.src = this.smallImage.src
              }} src={imgPlaceholder} alt={file.title} />
            </Modal>
          </Fragment>
        ))}
      </div>
    );
  }
}

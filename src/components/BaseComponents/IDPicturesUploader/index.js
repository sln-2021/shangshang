import { Icon } from '@ant-design/compatible';
//@ts-check
/// <reference path="../../../types.d.ts" />

/*
  身分验证 图片上传组件
*/

import React, { Fragment } from 'react';
import { Button,  Spin } from 'antd';
import { debugEcho, unused } from '../../../utils/debug';
import { pleaseContactDeveloper } from '../../../utils/pleaseContactDeveloper';
import styles from './index.less';
import { color } from '../../../common/color';

/**
 * @augments {React.PureComponent<{
    accept: string;
    files: ({title: string; name: string;})[];
    onUpload: (form: FormData, callback: Function) => any;
    fileMaxSize: number;
  }, {}>}
 */
export default class IDPicturesUploader extends React.PureComponent {
  constructor(props) {
    super(props);

    this.files = this.props.files.map(it => ({
      element: null,
      preview: null,
    }));

    this.state = {
      // wait, preview, uploading, uploaded
      status: this.props.files.map(it => 'wait'),
      error: '',
    };
  }

  onClickUpload() {
    const { files, onUpload, fileMaxSize } = this.props;
    const fileMaxSizeText = `${(fileMaxSize / 1024 / 1024).toFixed(2)} M`;
    const form = new FormData();

    let i = 0;
    for (const { element } of this.files) {
      const { title, name } = files[i];
      if (!element) return pleaseContactDeveloper(`IDPicturesUploader#this.files[${i}] 是空的!`);
      if (!element.files || element.files.length === 0) return alert(`请先选择选择 ${title} !`); //eslint-disable-line

      const file = element.files[0];
      if (file.size > fileMaxSize)
        return this.setState({ error: `${title} 的尺寸过大 (最大尺寸: ${fileMaxSizeText})` });

      form.append(name, file);
      i++;
    }
    this.setState({ status: this.files.map(it => 'uploading'), error: '' });

    const formKeys = Array.from(form.keys());
    debugEcho(formKeys);

    if (onUpload) onUpload(form, callback.bind(this));

    function callback(error) {
      this.setState({ status: this.files.map(it => (error ? 'preview' : 'uploaded')), error });
    }
  }

  onClickSelect(index) {
    const el = this.files[index].element;
    if (el) el.click();
  }

  onClickDelete(index) {
    const el = this.files[index].element;
    if (el) {
      el.value = '';
    }

    this.setFileStatus(index, 'wait');
  }

  onChange(index) {
    const el = this.files[index].element;
    if (!el) return;

    const { files } = el;
    if (!files || files.length !== 1) return;

    if (files[0]) {
      const reader = new FileReader();
      reader.onload = e => {
        //@ts-ignore
        this.files[index].preview = e.target.result;
        this.setFileStatus(index, 'preview');
      };
      reader.readAsDataURL(files[0]);
    }
    debugEcho(files[0]);
  }

  setFileStatus(index, status) {
    const dupStatus = [...this.state.status];
    dupStatus[index] = status;
    this.setState({ status: dupStatus });
  }

  bindInputElement(index, element) {
    this.files[index].element = element;
  }

  render() {
    const { files, accept } = this.props;
    const { status, error } = this.state;

    const couldUpload = status.reduce((a, b) => a && b !== 'wait', true);
    const isUploading = status.reduce((a, b) => a || b === 'uploading', false);
    const isUploaded = status.reduce((a, b) => a || b === 'uploaded', false);

    const uploaders = files.map((file, index) => {
      const st = status[index];
      return (
        <div key={file.name} className={styles.idUploadBox}>
          {st === 'wait' ? (
            <div className={styles.idUploadButton} onClick={this.onClickSelect.bind(this, index)}>
              <Icon type="upload" />
              <br />
              {`上传 ${file.title}`}
            </div>
          ) : (
            // preview or uploading
            <Spin spinning={st === 'uploading'}>
              <div className={styles.idUploadPreview}>
                <img alt={file.title} src={this.files[index].preview} />
              </div>
              {st === 'preview' ? (
                <div>
                  <a onClick={this.onClickSelect.bind(this, index)}>
                    <Icon type="edit" /> 修改
                  </a>
                  <a className={styles.idUploadDel} onClick={this.onClickDelete.bind(this, index)}>
                    <Icon type="delete" /> 删除
                  </a>
                  <span className={styles.idUploadSmall}>{file.title}</span>
                </div>
              ) : null}
            </Spin>
          )}

          <input
            type="file"
            ref={this.bindInputElement.bind(this, index)}
            style={{ display: 'none' }}
            accept={accept}
            onChange={this.onChange.bind(this, index)}
          />
        </div>
      );
    });

    return (
      <Fragment>
        <div className={styles.idUploadWrapper}>{uploaders}</div>
        {isUploaded ? (
          <span style={{ color: color.success }}> 上传成功! </span>
        ) : (
          <Button
            type="primary"
            disabled={!couldUpload}
            loading={isUploading}
            style={{ marginTop: 10 }}
            onClick={this.onClickUpload.bind(this)}
          >
            <Icon type="upload" />
            上传
          </Button>
        )}
        {error ? <span style={{ color: color.error }}> 上传失败: {error} </span> : null}
      </Fragment>
    );
  }
}

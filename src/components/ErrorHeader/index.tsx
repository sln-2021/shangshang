import { Alert } from 'antd';
import React, { Fragment } from 'react';

const ErrorHeader: React.FC<{
  message: React.ReactNode;
  error: React.ReactNode;
  clearError: Function;
  reload: Function;
}> = ({ message, error, clearError, reload }) => (
  <Fragment>
    <Alert
      message={message}
      type="error"
      showIcon
      style={{ marginBottom: 10 }}
      description={
        <span>
          错误信息: {error} <br />
          <a
            onClick={() => {
              reload!.reload();
              clearError();
            }}
          >
            <b>刷新页面</b>
          </a>
        </span>
      }
    />
  </Fragment>
);

export default ErrorHeader;

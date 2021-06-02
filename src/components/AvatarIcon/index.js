import { Icon } from '@ant-design/compatible';
//@ts-check
/// <reference path="../../types.d.ts" />

import React from 'react';
import { Avatar } from 'antd';
/**
 * @augments {React.Component<{
    iconURL: string;
    size?: number | "small" | "large" | "default" | undefined
    name: string;
  }, {}>}
 */
// @ts-ignore
export default class TokenIcon extends React.Component {
  state = {

  }


  render() {
    const { iconURL, size, name } = this.props;
    return (
      <span>
        {
          iconURL ?
            <Avatar shape="circle" size={size ? size : 'large'} src={iconURL} /> :
            <Avatar shape="circle" size={size ? size : 'large'}>{name ? name.toUpperCase().charAt(0) : '~'}</Avatar>
        }
      </span>
    );
  }
}

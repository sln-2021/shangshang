/*
  资金管理中提现管理 状态 展示 组件

  带有一个有色小圆点 或者是有色文本
*/

import React from 'react';
import { Badge } from 'antd';
import _ from 'lodash';

const statusText = {
  SUCCESS: '提现完成',
  FAILED: '提现失败',
  PENDING: '等待提现中',
  DEFAULT: '未知状态',
};

/** 就是那个状态小圆点的颜色字符串 */
const statusBadgeColor = {
  SUCCESS: 'success',
  PENDING: 'processing',
  FAILED: 'warning',
  DEFAULT: 'default',
};

const statusTextColor = {
  SUCCESS: '#52C41A',
  FAILED: '#D9D9D9',
  PENDING: '#D8D8D8',
  DEFAULT: '#FFAA39',
};

export default function WithdrawalState({ dot = true, textColor = true, rowRecord }) {
  let status = 'DEFAULT'

  if (rowRecord === 'SUCCESS') {
    status = 'SUCCESS'
  } else if (rowRecord === 'PENDING') {
    status = 'PENDING'
  } else {
    status = 'FAILED'
  }

  const text = textColor ? (
    <span style={{ color: statusTextColor[status] }}>{statusText[status]}</span>
  ) : (
    statusText[status]
  );
  return dot ? <Badge status={statusBadgeColor[status]} text={text} /> : text;
}

/*
  交易明细的 状态 展示 组件

  带有一个有色小圆点 或者是有色文本
*/

import React from 'react';
import { Badge } from 'antd';

const statusText = {
  SUCCESS: '交易成功',
  CLOSED: '交易关闭',
  PENDING: '等待确认中',
  SENDING: '交易传输中',
  DEFAULT: '未知状态',
};

/** 就是那个状态小圆点的颜色字符串 */
const statusBadgeColor = {
  SUCCESS: 'success',
  CLOSED: 'default',
  PENDING: 'default',
  SENDING: 'processing',
  DEFAULT: 'warning',
};

const statusTextColor = {
  SUCCESS: '#52C41A',
  CLOSED: '#D9D9D9',
  PENDING: '#D8D8D8',
  SENDING: '#1890FF',
  DEFAULT: '#FFAA39',
};

export default function TransStatus({ dot = true, textColor = true, status = 'DEFAULT' }) {
  const text = textColor ? (
    <span style={{ color: statusTextColor[status] }}>{statusText[status]}</span>
  ) : (
    statusText[status]
  );
  return dot ? <Badge status={statusBadgeColor[status]} text={text} /> : text;
}

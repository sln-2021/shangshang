// @ts-check

import { Switch } from 'antd';
import moment from 'moment';

/*
  这个通用模块用于 后端数据 到 前段显示 的转换

  因为会用到很多的 路由/子页面 中去, 所以请保证 类型检查 正确

  TODO: 为 I18N 做准备
*/

export const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
export const DATE_FORMAT = 'YYYY-MM-DD';
export const PHONE_AREA_CODE_MAP = {
  886: 'TW',
  86: 'CN',
  81: 'JP',
  61: 'AU',
  1: 'US'
};
export const PHONE_AREA_CODE = Object.keys(PHONE_AREA_CODE_MAP);

// 所属级别类型
export const TYPE_ENUM_MAP = {
  0: {
    name: '子渠道',
    color: '#EE0701',
    icon: '🍐'
  },
  1: {
    name: '渠道',
    color: '#0000FF',
    icon: '🍇'
  },
  2: {
    name: '尚尚游戏',
    color: '#CC317C',
    icon: '🍒'
  },
  3: {
    name: '选手',
    color: '#FF8247',
    icon: '🍍'
  },
};

// 审核类型
export const VALUE_ENUM_MAP = {
  0: '未审核',
  1: '通过',
  2: '已拒绝',
};

// 广告显示位置
export const ADVERTISING = {
  A: '登录',
  B: '普通场',
  C: '好友场',
  D: '比赛场',
};

// 商品类型
export const COMMODITY_TYPE = {
  1: '100钻石',
  2: '600钻石',
  3: '1800钻石',
  4: '3000钻石',
  5: '6800钻石',
  6: '32800钻石',
  7: '周卡(7天)，充值得7000金币，每日领取1000金币',
  8: '月卡(30天)，充值得30000金币，每日领取1000金币',
  9: '年卡(365天)，充值得360000金币，每日领取1000金币',
  10: '金币',
  11: '金币',
  12: '金币',
  13: '金币',
  14: '金币',
  15: '金币',
};

// 奖励类型
export const getRewardType = value => {
  const key = parseInt(value, 10)
  switch (key) {
    case -1: return {
      name: '游戏',
      color: '#FAAD14',
      icon: '🍐'
    }

    case 0: return {
      name: '实物',
      color: '#13C2C2',
      icon: '🍇'
    }

    case 1: return {
      name: '话费',
      color: '#52C41A',
      icon: '🍍'
    }


    default: return {
      name: '未知',
      color: '#999',
      icon: '🍍'
    }
  }
}


// 渠道审核类型
export const ORGANIZER_STATE_MAP = {
  '-1': {
    name: '封停',
    color: 'volcano',
    icon: '🏀',
    progress: 0
  },
  0: {
    name: '待审核',
    color: 'magenta',
    icon: '⚽',
    progress: 25
  },
  1: {
    name: '已认证',
    color: 'red',
    icon: '🏆',
    progress: 100
  },
  2: {
    name: '拒绝',
    color: 'volcano',
    icon: '🏀',
    progress: 0
  },
  3: {
    name: '待缴费',
    color: 'orange',
    icon: '⚾',
    progress: 50
  },
  4: {
    name: '待认证',
    color: 'gold',
    icon: '🎱',
    progress: 75
  },
};

// 用户类型
export const USER_TYPE_MAP = {
  root: '超级管理员',
  superAdmin: '主办方超级管理员',
  admin: '主办方管理管员',
  superOrganizers: '渠道超级管理员',
  organizers: '渠道管理员',
  superClub: '协办方超级管理员',
  club: '协办方管理员理',
  UNAUTHCONFERENCEUSER: '未认证承证办方管理员',
  UNAUTHCONFERENCEUSERSUBMIT: '未认证渠道管理员(已提交数据)',
  UNAUTHCLUBUSER: '未认证协证办方管理员',
  UNAUTHCLUBUSERSUBMIT: '未认证协办方管理员(已提交数据)',
};

export const USER_STATE_MAP = {
  '-1': '禁止登录',
  0: '游客待认证',
  1: '正常',
  2: '协办方游客待认证',
  3: '渠道游客待认证已提交',
  4: '协办方游客待认证已提交',
  5: '渠道游客待认证拒绝',
  6: '协办方游客待认证拒绝',
};

/**
 * @param {number|Date|moment.Moment} timestampOrDate
 * @returns {string}
 */
export function getDateTimeString(timestampOrDate) {
  if (timestampOrDate && typeof timestampOrDate === 'object') {
    if ('format' in timestampOrDate && typeof timestampOrDate.format === 'function')
      return timestampOrDate.format(DATE_TIME_FORMAT);

    if (timestampOrDate instanceof Date) return moment(timestampOrDate).format(DATE_TIME_FORMAT);
  }
  // 处理 java 返回数据多三个 0
  if (timestampOrDate > 15789114420)
    // @ts-ignore
    return moment(timestampOrDate / 1000, 'X').format(DATE_TIME_FORMAT);
  if (timestampOrDate === 0)
    // @ts-ignore
    return '--';

  return moment(timestampOrDate, 'X').format(DATE_TIME_FORMAT);
}

/**
 * @param {number|Date|moment.Moment} timestampOrDate
 * @returns {string}
 */
export function getDateString(timestampOrDate) {
  if (timestampOrDate && typeof timestampOrDate === 'object') {
    if ('format' in timestampOrDate && typeof timestampOrDate.format === 'function')
      return timestampOrDate.format(DATE_FORMAT);

    if (timestampOrDate instanceof Date) return moment(timestampOrDate).format(DATE_FORMAT);
  }
  // @ts-ignore
  return moment(new Date(timestampOrDate)).format(DATE_FORMAT);
}

/**
 * @param {string|number} data 
 * @returns {string}
 */
export function getEasyTimeString(data) {
  let str = ''
  str = String(data);
  if (!str) return '--'
  if (str.length !== 4) return '--'
  return `${str.slice(0, 2)}:${str.slice(2)}`
}

/** @param {string|number} money */
export function getReadableMoneyNumber(money) {
  // 为什么 .replace(/\d\d$/, '')
  //  因为精度问题, 例如: parseFloat('1.10400000').toFixed(16) === '1.1040000000000001'
  const str =
    typeof money === 'number' ?
      money
        .toFixed(16)
        .replace(/\d\d$/, '')
        .replace(/\.?0+$/, '') :
      String(money);
  return str.replace(/^(\s*)(\d+)/, (_, a, b) => {
    if (b.length <= 3) return `${a}${b}`;
    const mod = b.length % 3;
    let head = b.slice(0, mod);
    if (head) head += ',';
    return `${a}${head}${b
      .slice(mod)
      .split(/(\d{3})/)
      .filter(it => it)
      .join(',')}`;
  });
}

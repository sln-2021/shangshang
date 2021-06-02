//@ts-check
/*
  用于转换钱币数额的模块

  更新日志:
  2018-06-14:  允许了 0 位小数点 (刘越)
  2018-06-15:  修复了科学计数法的BUG: removeZeroAfterIntString
  2018-06-20:  增加了 toFixed2IfNeeded
  2018-07-06:  修复了科学计数法的显示BUG: (使用 decimal.js)
  2018-07-20:  添加了更加准确的钱币转换函数: getReadableMoney2
  2018-10-20:  在 getReadableMoney2 中加入了 try/catch, 保证了异常 money 参数不会使得页面崩溃
*/

import { Decimal } from "decimal.js";
import { isDevelopment, devAssert } from "../utils/debug";

// @ts-ignore
if (isDevelopment()) window.Decimal = Decimal; // export for debug


const MAX_ZERO_COUNT = 128;
const ZERO_STRING = Array(MAX_ZERO_COUNT).fill('0').join('');

/**
 * @param {string|number} integer
 * @param {number} countOfZero
 */
export function appendZeroAfterInteger(integer, countOfZero) {
  // @ts-ignore
  devAssert(isNaN(integer), false, `!isNaN(integer: ${integer})`, true); // devAssert: true  => only in console
  devAssert(countOfZero >= 0, true, `countOfZero (actual: ${countOfZero}) >= 0`, true);
  devAssert(countOfZero < MAX_ZERO_COUNT, true, `countOfZero (actual: ${countOfZero}) < 128`, true);

  // @ts-ignore for Math.floor
  const baseString = Math.floor(integer).toFixed(0);
  return baseString + ZERO_STRING.slice(0, countOfZero);
}

/**
 * @param {string|number} intString
 * @param {number} countOfZero
 */
export function removeZeroAfterIntString(intString, countOfZero) {
  devAssert(countOfZero >= 0, true, `countOfZero (actual: ${countOfZero}) >= 0`, true);
  devAssert(countOfZero < MAX_ZERO_COUNT, true, `countOfZero (actual: ${countOfZero}) < 128`, true);

  //#new bug: 1.39e+27 => 1,000,000,000
  intString = new Decimal(intString).toFixed();

  //#region  修复科学计数法, 例如: 8e+25
  // const expMatch = intString.match(/\+(\d+)$/);
  // if (expMatch) {
  //   const exp = parseInt(expMatch[1], 10);
  //   //@ts-ignore
  //   intString = [(intString / 10 ** exp).toFixed(0), ZERO_STRING.slice(0, exp)].join('');
  // }
  //#endregion

  const removeFrom = intString.length - countOfZero;
  devAssert(intString.slice(removeFrom), ZERO_STRING.slice(0, countOfZero), '`intString` endsWith 0', true);

  return intString.slice(0, removeFrom);
}

/**
 * @param {string|number} money
 * @param {number} [toFixed=-1]
 * @returns {string}
 */
export function getReadableMoney2(money, toFixed = -1) {
  let dec = null;
  try { dec = new Decimal(money); }
  catch (ex) {
    console.error(`Invalid money: ${JSON.stringify(money)} (getReadableMoney2)`); // eslint-disable-line
    return String(money);
  }
  const parts = (toFixed >= 0 ? dec.toFixed(toFixed) : dec.toFixed()).split('.');

  const minus = parts[0][0] === '-';
  const absIntStr = minus ? parts[0].slice(1) : parts[0];
  // 如果整数部分小于 1000
  if (absIntStr.length <= 3)
    return parts.join('.');

  const mod = absIntStr.length % 3;
  const head = mod === 0 ? '' : `${absIntStr.slice(0, mod)},`;
  const partInt = head + absIntStr.slice(mod).split(/(\d{3})/).filter(it => it).join(',');
  const result = parts.length > 1 ? `${partInt}.${parts[1]}` : partInt;
  return (minus ? '-' : '') + result;
}

/** @param {string|number} money */
export function getReadableMoneyNumber(money) {
  // 为什么 .replace(/\d\d$/, '')
  //  因为精度问题, 例如: parseFloat('1.10400000').toFixed(16) === '1.1040000000000001'
  const str = (typeof money === 'number')
    ? money.toFixed(16).replace(/\d\d$/, '').replace(/\.?0+$/, '')
    : String(money);
  return str.replace(/^(\s*)(\d+)/, (_, a, b) => {
    if (b.length <= 3)
      return `${a}${b}`;
    const mod = b.length % 3;
    let head = b.slice(0, mod);
    if (head) head += ',';
    return `${a}${head}${b.slice(mod).split(/(\d{3})/).filter(it => it).join(',')}`;
  });
}

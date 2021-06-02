/* eslint-disable no-restricted-syntax */
// @ts-check

/*
  这个小工具模块是用来调试的

  (!! 仅用于调试, 请勿使用到生产环境中)

  TODO: 添加生产环境警告及过滤

  Author: Liu Yue
  Modified: 2018-09-06
*/

import _ from 'lodash';

export function unused(...param) { }

export function isDevelopment() {
  if (!process || !process.env) return false;
  if (process.env.NODE_ENV === 'development') return true;
  return false;
}

/**
 * @param {any} object
 * @param {(string|string[])[]} names
 */
export function ensureFields(object, ...names) {
  if (isDevelopment()) {
    const fields = _.flatten(names);
    const msg = `(but expected fields: ${fields.join(', ')})`;
    if (!object) return ensureFieldsAlert(`object is empty! ${msg}`);
    for (const field of fields)
      if (!(field in object)) return ensureFieldsAlert(`object.${field} is missing! ${msg}`);
  }
}
function ensureFieldsAlert(message) {
  const caller = getCaller(ensureFields.name);
  const display = `ensureFields: ${message}\n\ncaller: ${caller}`;
  // eslint-disable-next-line
  return console.error(display), alert(display);
}

/**
 * 开发断言
 * @param {any} a
 * @param {any} b
 * @param {string} [message]
 */
export function devAssert(a, b, message = undefined, onlyInConsole = false) {
  if (isDevelopment()) {
    if (a === b) return;
    const msg = `devAssert: ${JSON.stringify(a)} !== ${JSON.stringify(b)}\n${(message ? `message: ${message}` : '')}`
    // eslint-disable-next-line
    console.error(msg); if (!onlyInConsole) { alert(msg); }
  }
}

/**
 * 开发断言
 * @param {any} value
 * @param {string} [message]
 */
export function devAssertNotFalsy(value, message = undefined) {
  if (isDevelopment()) {
    if (value) return;
    // eslint-disable-next-line
    alert(`devAssert: ${JSON.stringify(value)} is falsy\n${message ? `message: ${message}` : ''}`);
  }
}

/**
 * 开发类型断言
 * @param {any} value
 * @param {"string"|"number"|"object"|"function"|"undefined"|"boolean"|"symbol"} type
 * @param {string} [message]
 */
export function devAssertTypeof(value, type, message = undefined) {
  if (isDevelopment()) {
    if (typeof value === type) //eslint-disable-line
      return;
    //eslint-disable-next-line
    alert(
      `devAssert: ${JSON.stringify(value)} is not ${type}\n${message ? `message: ${message}` : ''}`
    );
  }
}

/**
 * 用法: `func = res => res(value);`
 * 这时你想观察 `value` 的值，你就可以这样嵌套:
 * `func = res => debugEcho(value);`
 * 或:
 * `func = res => debugEcho();`
 * @template T
 * @param {T} value
 * @param {string} [name]
 * @return {T}
 */
export function debugEcho(value, name) {
  /*
    此处的 enableDebugEcho 是在 .webpackrc.js 中定义的

    仅在 NODE_ENV == 'development' 的情况下 enableDebugEcho == true

    所以, 当 npm start 的时候 能显示.
    在 npm run build 发布生产模式代码的时候不会显示
  */
  // @ts-ignore
  if (typeof enableDebugEcho !== 'undefined' && enableDebugEcho === true) {
    // eslint-disable-line

    if (!name) name = getCaller(debugEcho.name);
    name = String(name || 'Unknown Function');
    name += ' > debugEcho:\n';
    console.log(name, value); //eslint-disable-line
  }
  return value;
}

function getCaller(currentFuncName = '') {
  const stacks = new Error().stack.split('\n');
  for (let i = 0; i < stacks.length; i++) {
    if (stacks[i].trim().startsWith(`at ${currentFuncName}`)) {
      return (stacks[i + 1] || '').replace(/^\s*at\s+/, '');
    }
  }
  return '';
}

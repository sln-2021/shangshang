// @ts-check
/// <reference path="../types.d.ts" />
import _ from 'lodash';

const FORM_FIELD_TRANSLATE = {
  version: '版本编号',
};

/** 后端返回的 Token 信息存储失败的错误 */
export const ERROR_NO_TOKEN_INFO = 10086;
/** 两次密码不相同的错误 */
export const ERROR_PASSWD_DIFF = 20488;

/**
 * 判断一个请求返回信息是否包含错误
 * @param {{status: number, msg: any}} response
 */
export function hasError(response) { return response && response.status !== 200; }

/**
 * 从一个请求返回信息中获得错误的描述标题
 * @param {{status: number, msg: any}} response
 * @param {string} [forceCategory] 强制设置错误类别 (不管后端返回什么错误类别)
 */
export function getErrorTitle(response, forceCategory = null) {
  try { return parse(); } catch (error) { return `未知错误`; }

  function parse() {
    if (!response)
      response = { status: 0, msg: null };

    const respBody = isString(response.msg) ? parseResponse(response.msg) : response.msg;
    /** 产生错误的操作类目,例如: ['ADMIN', 'UPDATE'] */
    if (response.status === 500) return '服务器内部错误';
    if (response.status === 403) return '权限不足';
    return '操作出错';
  }
}

/**
 * 从一个请求返回信息中获得错误的详细描述
 * @param {{status: number, msg: any}} response
 * @param {string} [forceCategory] 强制设置错误类别 (不管后端返回什么错误类别)
 */
export function getErrorMessage(response, forceCategory = null) {
  try { return parse(); }
  catch (error) { return `未知错误, 服务器返回: ${response.status} 处理异常: ${error.message || error}`; }

  function parse() {
    if (!response)
      response = { status: 0, msg: null };

    let respText = '';
    let respBody = null;
    if (isString(response.msg)) {
      respText = response.msg;
      respBody = parseResponse(respText);
    } else {
      respText = JSON.stringify(response.msg);
      respBody = response.msg;
    }

    /** HTTP 响应码 */
    const statusCode = response.status;
    /** 服务器提供的默认错误消息 */
    const errorMsg = _.get(respBody, 'msg', '') || respText;
    const defaultErrorMsg = errorMsg
    /** 服务器提供错误详细分类编号: 例如: 107: notAllow, 102: duplicated, ... */
    const errorCode = _.get(respBody, 'status', 1) || 1;

    // 表单错误
    if (statusCode === 400 && errorCode === 101) {
      /** @type {any[]} */
      let errors = _.get(respBody, 'errors', []);
      if (!Array.isArray(errors)) errors = [];
      const msg = [];
      errors.forEach(e => {
        const { field, type } = _.pick(e, 'field', 'msg', 'type');
        const why = type === 'invalid' ? '无效的 ' : type;
        if (Object.prototype.hasOwnProperty.call(FORM_FIELD_TRANSLATE, field))
          return msg.push(`${why}${FORM_FIELD_TRANSLATE[field]}`);
        msg.push(`${why}${field}`);
      });
      if (msg.length > 0) return msg.join(' ');
      return errorMsg || '未知表单错误';
    }

    if (statusCode === 500) return `服务器内部错误: ${errorMsg}`;
    if (statusCode === 404) return `条目不存在: ${errorMsg}`;
    if (statusCode === 403) return `无权操作: ${errorMsg}`;


    if (statusCode === 101) return `上传错误: ${errorMsg}`;
    if (statusCode === 108) return `上传错误: ${errorMsg}`;

    return defaultErrorMsg || '未知服务器错误';
  }
}

function parseResponse(msg) {
  if (typeof msg === 'object') return msg;
  if (typeof msg !== 'string') return {};
  try { return JSON.parse(msg); }
  catch (error) { return {}; }
}

function isString(obj) {
  return typeof obj === 'string';
}

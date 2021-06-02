// @ts-check

/*
  用于 ant design Form 组件的 validators

  更新日志:
  2018-06-06:  添加了注释 (刘越)
*/

// import EmailValidator from "email-validator";

export function validateEmail(_, value, cb) {
  return cb(EmailValidator.validate(value) ? undefined : '请填入有效的Email地址');
}

/**
 * 验证地址字段是否正确. Example:
 * rules: [{required: true, validator: (_, value, cb) => validateAddress.bind(this, 'eth')}]
 *
 * @param {'email'|'eth'|'dbc'|'btc'} type
 * @param {any} _
 * @param {string} value
 * @param {Function} cb
 */
export function validateAddress(type, _, value, cb) {
  const v = String(value);
  if (type === 'email')
    return cb(EmailValidator.validate(v) ? undefined : '请填入有效的Email地址');
  if (type === 'eth' || type === 'dbc') {
    if (!v.startsWith('0x')) return cb('请填入有效的地址 (请保证以0x开头)');
    if (v.length !== 42) return cb('请填入有效的地址 (长度是42)');
  }
  if (type === 'btc')
    return cb(v.length === 34 ? undefined : '请输入有效的比特币的地址 (长度是34)');

  return cb();
}

export function validateSendETHorDBCAddress(_, value, cb) {
  const v = String(value);
  if (EmailValidator.validate(v)) return cb();
  if (!v.startsWith('0x')) return cb('请填入有效的地址 (请保证以0x开头)');
  if (v.length !== 42) return cb('请填入有效的地址 (长度是42)');
  return cb();
}

export function validateSendBTCAddress(_, value, cb) {
  const v = String(value);
  if (EmailValidator.validate(v)) return cb();
  return cb(v.length === 34 ? undefined : '请输入有效的比特币的地址 (长度是34)');
}


/**
 * 创建一个正整数验证器
 * @param {string} name
 */
export function createSafePositiveIntValidator(name) {
  return function positiveInt(_, value, cb) {
    const v = parseFloat(value);
    if (isNaN(v) || v <= 0) return cb(`${name} 必须是正整数!`);
    if (!Number.isSafeInteger(v)) return cb(`${name} 的数值过大!`);
    return cb();
  }
}

/**
 * 创建一个整数范围验证器
 * @param {string} name
 * @param {number} greaterEqualThan
 * @param {number} lessEqualThan
 */
export function createIntRangeValidator(name, greaterEqualThan, lessEqualThan) {
  return function positiveInt(_, value, cb) {
    const v = parseFloat(value);
    if (isNaN(v) || !Number.isSafeInteger(v)) return cb(`${name} 必须是整数!`);
    if (v < greaterEqualThan) return cb(`${name} 必须大于等于 ${greaterEqualThan}`);
    if (v > lessEqualThan) return cb(`${name} 必须小于等于 ${lessEqualThan}`);
    return cb();
  }
}

/**
 * 创建一个最大2mb的图片验证器
 * @param {any} rule
 * @param {any} value
 * @param {Function} callback
 */
export function validateImage(rule, value, callback) {
  if (!value) callback('请上传文件!');
  const { file } = value;
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  const isLt2M = file.size / 1024 / 1024 < 1;
  if (!isJpgOrPng) {
    callback('您只能上传JPG/PNG文件!');
  } else if (!isLt2M) {
    callback('图像必须小于2MB!');
  } else {
    callback();
  }
};

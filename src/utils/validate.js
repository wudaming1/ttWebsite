/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  return str && str.length > 4
}

export function isMobileNumber(value) {
  if (value === null) {
    return false
  }
  if (/^\d{11}$/.test(value)) {
    return true
  }
  return false
}

export function isMoney(value) {
  return /^[1-9]\d*$/.test(value)
}

export function isEmpty(value) {
  return value === undefined || value === null || value === ''
}

export function moneyValidator(rule, value, callback) {
  if (!isMoney(value)) {
    callback(new Error('请输入正确的金额！'))
  } else {
    callback()
  }
}

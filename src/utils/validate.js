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
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/**
 * @param {string} url
 * @returns {Boolean}
 */
export function validURL(url) {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail(email) {
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function isString(str) {
  if (typeof str === 'string' || str instanceof String) {
    return true
  }
  return false
}

/**
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray(arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}

/* 是否手机号码*/
export function validatePhone(rule, value, callback) {
  // const reg = /^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/;;
  const reg = /^\s*\+?\s*(\(\s*\d+\s*\)|\d+)(\s*-?\s*(\(\s*\d+\s*\)|\s*\d+\s*))*\s*$/
  if (value === '' || value === undefined || value === null) {
    callback(new Error('mobile is required'))
  } else {
    if ((!reg.test(value)) && value !== '') {
      callback(new Error('Please enter the correct phone number'))
    } else {
      callback()
    }
  }
}

export function validateLon(rule, value, callback) {
  if (!value) {
    return callback(new Error('longitude is required'))
  }
  if (!Number(value) && Number(value) !== 0) {
    callback(new Error('Please enter the correct longitude'))
  } else {
    if (value < -180 || value > 180) {
      callback(new Error('Please enter the correct longitude'))
    } else {
      callback()
    }
  }
}

// 验证纬度格式及范围是否正确
export function validateLat(rule, value, callback) {
  if (!value) {
    return callback(new Error('latitude is required'))
  }
  if (!Number(value) && Number(value) !== 0) {
    callback(new Error('Please enter the correct latitude'))
  } else {
    if (value < -180 || value > 180) {
      callback(new Error('Please enter the correct latitude'))
    } else {
      callback()
    }
  }
}

// 验证电池容量格式及范围是否正确
export function validateCap(rule, value, callback) {
  if (!value) {
    return callback(new Error('Battery Capacity is required is required'))
  }
  if (!Number(value) && Number(value) !== 0) {
    callback(new Error('Please enter the correct Battery Capacity'))
  } else {
    if (value < 0) {
      callback(new Error('Please enter the correct Battery Capacity'))
    } else {
      callback()
    }
  }
}

/* 是否手机号码或者固话*/
export function validatePhoneTwo(rule, value, callback) {
  const reg = /^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/
  if (value == '' || value == '无') {
    callback()
  }
  if (value == '' || value == undefined || value == null) {
    callback()
  } else {
    if ((!reg.test(value)) && value != '') {
      callback(new Error('Please enter the correct phone number'))
    } else {
      callback()
    }
  }
}

/* 是否正负整数或正负小数*/
export function validateMath(rule, value, callback) {
  // 验证是否是整数或小数
  // const reg = /^[+-]?([0-9]*\.?[0-9]+|[0-9]+\.?[0-9]*)([eE][+-]?[0-9]+)?$/
  const reg = /^-?([0-9]*\.?[0-9]+|[0-9]+\.?[0-9]*)$/
  if (value == '' || value == undefined || value == null) {
    callback()
  } else {
    if (!reg.test(value)) {
      callback(new Error('请输入数字'))
    } else {
      if (typeof rule.maxm === 'number' && Number(value) > rule.maxm) {
        callback(new Error(`数值不能超过${rule.maxm}`))
      } else if (typeof rule.minm === 'number' && Number(value) < rule.minm) {
        callback(new Error(`数值不能低于${rule.minm}`))
      }
      // if(rule.minmax[0]<Number(value)&&rule.minmax[1]>Number(value)) {
      //   callback(new Error(rule.minmaxComment))
      // }
      callback()
    }
  }
}

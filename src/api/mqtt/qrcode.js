import request from '@/utils/request'

/**
 * 激活码校验
 * @param {String} 激活码序列号
 * @return {Object}
 */
export function mqttqrcodeContrast(data) {
  return request({
    url: `/sys/qrcode/contrastInfo/${data}`,
    method: 'post',
    data
  })
}

/**
 * 激活码校验
 * @return {object}
 */
export function mqttqrcodeCheck(data) {
  return request({
    url: '/sys/qrcode/getInfo',
    method: 'post',
    data
  })
}

/**
 * 获取二维码
 * @return {object}
 */
export function mqttqrcodeGet(data) {
  return request({
    url: '/sys/qrcode/getQRCode',
    method: 'post',
    data
  })
}

/**
 * 保存序列号
 * @param {Object}
 * @return {object}
 */
export function mqttqrcodeSave(data) {
  return request({
    url: '/sys/qrcode/save',
    method: 'post',
    data
  })
}

/**
 * 获取序列号
 * @param {String} 传入mac
 * @return {object}
 */
export function mqttqrcodeTransition(data) {
  return request({
    url: `/sys/qrcode/transition/${data}`,
    method: 'post',
    data
  })
}

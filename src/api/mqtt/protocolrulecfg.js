import request from '@/utils/request'
// 删除
export function getFarmprotocolrulecfgDelete(data) {
  return request({
    baseURL: $_mqttIp,
    url: '/sys/farmprotocolrulecfg/delete',
    method: 'post',
    data
  })
}
// 详情
export function getFarmprotocolrulecfg(data) {
  return request({
    baseURL: $_mqttIp,
    url: '/sys/farmprotocolrulecfg/info/' + data,
    method: 'post',
    data
  })
}
// 列表
export function getFarmprotocolrulecfgList(data) {
  return request({
    baseURL: $_mqttIp,
    url: '/sys/farmprotocolrulecfg/list',
    method: 'post',
    data
  })
}
// 保存
export function getFarmprotocolrulecfgSave(data) {
  return request({
    baseURL: $_mqttIp,
    url: '/sys/farmprotocolrulecfg/save',
    method: 'post',
    data
  })
}
// 修改
export function getFarmprotocolrulecfgUpdate(data) {
  return request({
    baseURL: $_mqttIp,
    url: '/sys/farmprotocolrulecfg/update',
    method: 'post',
    data
  })
}

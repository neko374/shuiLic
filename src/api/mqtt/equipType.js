import request from '@/utils/request'
// 删除
export function getEquipTypeDelete(data) {
  return request({
    baseURL: $_mqttIp,
    url: '/sys/farmprotocolinfo/delete',
    method: 'post',
    data
  })
}
// 详情
export function getEquipTypeInfo(data) {
  return request({
    baseURL: $_mqttIp,
    url: '/sys/farmprotocolinfo/info/' + data,
    method: 'post',
    data
  })
}
// 列表
export function getEquipTypeList(data,timeout) {
  timeout = timeout || 8000
  return request({
    baseURL: $_mqttIp,
    timeout,
    url: '/sys/farmprotocolinfo/list',
    method: 'post',
    data
  })
}
// 保存
export function getEquipTypeSave(data) {
  return request({
    baseURL: $_mqttIp,
    url: '/sys/farmprotocolinfo/save',
    method: 'post',
    data
  })
}
// 修改
export function getEquipTypeUpdate(data) {
  return request({
    baseURL: $_mqttIp,
    url: '/sys/farmprotocolinfo/update',
    method: 'post',
    data
  })
}

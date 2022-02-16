import request from '@/utils/request'
// 删除
export function getComponentDelete(data) {
  return request({
    baseURL: $_mqttIp,
    url: '/sys/farmcomponentinfo/delete',
    method: 'post',
    data
  })
}
// 详情
export function getComponentInfo(data) {
  return request({
    baseURL: $_mqttIp,
    url: '/sys/farmcomponentinfo/info/' + data,
    method: 'post',
    data
  })
}
// 列表
export function getComponentList(data) {
  return request({
    baseURL: $_mqttIp,
    url: '/sys/farmcomponentinfo/list',
    method: 'post',
    data
  })
}
// 保存
export function getComponentSave(data) {
  return request({
    baseURL: $_mqttIp,
    url: '/sys/farmcomponentinfo/save',
    method: 'post',
    data
  })
}
// 修改
export function getComponentUpdate(data) {
  return request({
    baseURL: $_mqttIp,
    url: '/sys/farmcomponentinfo/update',
    method: 'post',
    data
  })
}

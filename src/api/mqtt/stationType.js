import request from '@/utils/request'
// 删除
export function getStationTypeDelete(data) {
  return request({
    baseURL: $_mqttIp,
    url: '/sys/farmprotocoltypeinfo/delete',
    method: 'post',
    data
  })
}
// 详情
export function getStationTypeInfo(data) {
  return request({
    baseURL: $_mqttIp,
    url: '/sys/farmprotocoltypeinfo/info/' + data,
    method: 'post',
    data
  })
}
// 列表
export function getStationTypeList(data) {
  return request({
    baseURL: $_mqttIp,
    url: '/sys/farmprotocoltypeinfo/list',
    method: 'post',
    data
  })
}
// 保存
export function getStationTypeSave(data) {
  return request({
    baseURL: $_mqttIp,
    url: '/sys/farmprotocoltypeinfo/save',
    method: 'post',
    data
  })
}
// 修改
export function getStationTypeUpdate(data) {
  return request({
    baseURL: $_mqttIp,
    url: '/sys/farmprotocoltypeinfo/update',
    method: 'post',
    data
  })
}

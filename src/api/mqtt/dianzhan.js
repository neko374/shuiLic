import request from '@/utils/request'
// 删除
export function getFarmcfginfoDelete(data) {
  return request({
    baseURL: $_mqttIp,
    url: '/sys/farmcfginfo/delete',
    method: 'post',
    data
  })
}
// 详情
export function getFarmcfginfo(data) {
  return request({
    baseURL: $_mqttIp,
    url: '/sys/farmcfginfo/info/' + data,
    method: 'post',
    data
  })
}
// 列表
export function getFarmcfginfoList(data) {
  return request({
    baseURL: $_mqttIp,
    url: '/sys/farmcfginfo/list',
    method: 'post',
    data
  })
}
// 保存
export function getFarmcfginfoSave(data) {
  return request({
    baseURL: $_mqttIp,
    url: '/sys/farmcfginfo/save',
    method: 'post',
    data
  })
}
// 修改
export function getFarmcfginfoUpdate(data) {
  return request({
    baseURL: $_mqttIp,
    url: '/sys/farmcfginfo/update',
    method: 'post',
    data
  })
}

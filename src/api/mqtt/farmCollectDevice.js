import request from '@/utils/request'
// 删除
export function getCollectDeviceDelete(data) {
  return request({
    baseURL: $_mqttIp,
    url: '/sys/aipowerprojectcollectordeviceinfocontroller/delete',
    method: 'post',
    data
  })
}
// 详情
export function getCollectDeviceInfo(data) {
  return request({
    baseURL: $_mqttIp,
    url: '/sys/aipowerprojectcollectordeviceinfocontroller/info/' + data,
    method: 'post',
    data
  })
}
// 列表
export function getCollectDeviceList(data) {
  return request({
    baseURL: $_mqttIp,
    url: '/sys/aipowerprojectcollectordeviceinfocontroller/list',
    method: 'post',
    data
  })
}
// 保存
export function getCollectDeviceSave(data) {
  return request({
    baseURL: $_mqttIp,
    url: '/sys/aipowerprojectcollectordeviceinfocontroller/save',
    method: 'post',
    data
  })
}
// 修改
export function getCollectDeviceUpdate(data) {
  return request({
    baseURL: $_mqttIp,
    url: '/sys/aipowerprojectcollectordeviceinfocontroller/update',
    method: 'post',
    data
  })
}

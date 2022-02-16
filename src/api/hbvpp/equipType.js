import request from '@/utils/request'
// 删除
export function getEquipTypeDelete(data) {
  return request({
    baseURL: PhotovoltaicIp,
    url: '/sys/farmprotocolinfo/delete',
    method: 'post',
    data
  })
}
// 详情
export function getEquipTypeInfo(data) {
  return request({
    baseURL: PhotovoltaicIp,
    url: '/sys/farmprotocolinfo/info/' + data,
    method: 'post',
    data
  })
}
// 列表
export function getEquipTypeList(data) {
  return request({
    baseURL: PhotovoltaicIp,
    url: '/sys/farmprotocolinfo/list',
    method: 'post',
    data
  })
}
// 保存
export function getEquipTypeSave(data) {
  return request({
    baseURL: PhotovoltaicIp,
    url: '/sys/farmprotocolinfo/save',
    method: 'post',
    data
  })
}
// 修改
export function getEquipTypeUpdate(data) {
  return request({
    baseURL: PhotovoltaicIp,
    url: '/sys/farmprotocolinfo/update',
    method: 'post',
    data
  })
}

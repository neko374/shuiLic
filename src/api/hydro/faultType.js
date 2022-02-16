import request from '@/utils/request'

export function hydroFaultTypeDelete(data) {
  return request({
    baseURL: hydroIp,
    url: '/sys/hessdictinfo/delete',
    method: 'post',
    data
  })
}

export function hydroFaultTypeInfo(data) {
  return request({
    baseURL: hydroIp,
    url: '/sys/hessdictinfo/info' + data,
    method: 'post',
    data
  })
}

export function hydroFaultTypeList(data) {
  return request({
    baseURL: hydroIp,
    url: '/sys/hessdictinfo/list',
    method: 'post',
    data
  })
}

export function hydroFaultTypeSave(data) {
  return request({
    baseURL: hydroIp,
    url: '/sys/hessdictinfo/save',
    method: 'post',
    data
  })
}

export function hydroFaultTypeUpdate(data) {
  return request({
    baseURL: hydroIp,
    url: '/sys/hessdictinfo/update',
    method: 'post',
    data
  })
}

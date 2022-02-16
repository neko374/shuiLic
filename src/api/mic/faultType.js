import request from '@/utils/request'

export function micFaultTypeDelete(data) {
  return request({
    baseURL: MicrogridIp,
    url: '/sys/hessdictinfo/delete',
    method: 'post',
    data
  })
}

export function micFaultTypeInfo(data) {
  return request({
    baseURL: MicrogridIp,
    url: '/sys/hessdictinfo/info' + data,
    method: 'post',
    data
  })
}

export function micFaultTypeList(data) {
  return request({
    baseURL: MicrogridIp,
    url: '/sys/hessdictinfo/list',
    method: 'post',
    data
  })
}

export function micFaultTypeSave(data) {
  return request({
    baseURL: MicrogridIp,
    url: '/sys/hessdictinfo/save',
    method: 'post',
    data
  })
}

export function micFaultTypeUpdate(data) {
  return request({
    baseURL: MicrogridIp,
    url: '/sys/hessdictinfo/update',
    method: 'post',
    data
  })
}

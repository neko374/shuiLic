import request from '@/utils/request'

export function micOrderDelete(data) {
  return request({
    baseURL: MicrogridIp,
    url: '/sys/hessorder/delete',
    method: 'post',
    data
  })
}

export function micOrderInfo(data) {
  return request({
    baseURL: MicrogridIp,
    url: '/sys/hessorder/info' + data,
    method: 'post',
    data
  })
}

export function micOrderList(data) {
  return request({
    baseURL: MicrogridIp,
    url: '/sys/hessorder/list',
    method: 'post',
    data
  })
}

export function micOrderSave(data) {
  return request({
    baseURL: MicrogridIp,
    url: '/sys/hessorder/save',
    method: 'post',
    data
  })
}

export function micOrderUpdate(data) {
  return request({
    baseURL: MicrogridIp,
    url: '/sys/hessorder/update',
    method: 'post',
    data
  })
}

import request from '@/utils/request'

export function hydroOrderDelete(data) {
  return request({
    baseURL: hydroIp,
    url: '/sys/hessorder/delete',
    method: 'post',
    data
  })
}

export function hydroOrderInfo(data) {
  return request({
    baseURL: hydroIp,
    url: '/sys/hessorder/info' + data,
    method: 'post',
    data
  })
}

export function hydroOrderList(data) {
  return request({
    baseURL: hydroIp,
    url: '/sys/hessorder/list',
    method: 'post',
    data
  })
}

export function hydroOrderSave(data) {
  return request({
    baseURL: hydroIp,
    url: '/sys/hessorder/save',
    method: 'post',
    data
  })
}

export function hydroOrderUpdate(data) {
  return request({
    baseURL: hydroIp,
    url: '/sys/hessorder/update',
    method: 'post',
    data
  })
}

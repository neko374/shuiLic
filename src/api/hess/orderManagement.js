import request from '@/utils/request'

export function hessOrderDelete(data) {
  return request({
    baseURL: hessIp,
    url: '/sys/hessorder/delete',
    method: 'post',
    data
  })
}

export function hessOrderInfo(data) {
  return request({
    baseURL: hessIp,
    url: '/sys/hessorder/info' + data,
    method: 'post',
    data
  })
}

export function hessOrderList(data) {
  return request({
    baseURL: hessIp,
    url: '/sys/hessorder/list',
    method: 'post',
    data
  })
}

export function hessOrderSave(data) {
  return request({
    baseURL: hessIp,
    url: '/sys/hessorder/save',
    method: 'post',
    data
  })
}

export function hessOrderUpdate(data) {
  return request({
    baseURL: hessIp,
    url: '/sys/hessorder/update',
    method: 'post',
    data
  })
}

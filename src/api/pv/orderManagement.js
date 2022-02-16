import request from '@/utils/request'

export function pvOrderDelete(data) {
  return request({
    url: '/sys/hessorder/delete',
    method: 'post',
    data
  })
}

export function pvOrderInfo(data) {
  return request({
    url: '/sys/hessorder/info' + data,
    method: 'post',
    data
  })
}

export function pvOrderList(data) {
  return request({
    url: '/sys/hessorder/list',
    method: 'post',
    data
  })
}

export function pvOrderSave(data) {
  return request({
    url: '/sys/hessorder/save',
    method: 'post',
    data
  })
}

export function pvOrderUpdate(data) {
  return request({
    url: '/sys/hessorder/update',
    method: 'post',
    data
  })
}

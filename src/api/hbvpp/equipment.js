import request from '@/utils/request'

export function hessDelete(data) {
  return request({
    url: '/sys/hessbattery/delete',
    method: 'post',
    data: data
  })
}

export function hessInfo(data) {
  return request({
    url: '/sys/hessbattery/info/' + data,
    method: 'post',
    data: data
  })
}

export function hessList(data) {
  return request({
    url: '/sys/hessbattery/list',
    method: 'post',
    data: data
  })
}

export function hessSave(data) {
  return request({
    url: '/sys/hessbattery/save',
    method: 'post',
    data: data
  })
}

export function hessUpdate(data) {
  return request({
    url: '/sys/hessbattery/update',
    method: 'post',
    data: data
  })
}


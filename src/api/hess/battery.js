import request from '@/utils/request'

export function getHessDelete(data) {
  return request({
    url: '/sys/hessbattery/delete',
    method: 'post',
    data
  })
}

export function getHessInfo(data) {
  return request({
    url: '/sys/hessbattery/info' + data,
    method: 'post',
    data
  })
}

export function getHessList(data) {
  return request({
    url: '/sys/hessbattery/list',
    method: 'post',
    data
  })
}

export function getHessSave(data) {
  return request({
    url: '/sys/hessbattery/save',
    method: 'post',
    data
  })
}

export function getHessUpdate(data) {
  return request({
    url: '/sys/hessbattery/update',
    method: 'post',
    data
  })
}

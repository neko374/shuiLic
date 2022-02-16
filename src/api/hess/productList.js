import request from '@/utils/request'

export function ProductListGetList(data) {
  return request({
    baseURL: 'http://47.103.79.116:8765/hess',
    url: '/sys/hessbattery/list',
    method: 'post',
    data: data
  })
}

export function ProductListAdd(data) {
  return request({
    baseURL: '',
    url: 'http://47.103.79.116:8765/hess/sys/hessbattery/save',
    method: 'post',
    data: data
  })
}

export function ProductListUpdate(data) {
  return request({
    baseURL: '',
    url: 'http://47.103.79.116:8765/hess/sys/hessbattery/update',
    method: 'post',
    data: data
  })
}

export function ProductListDelete(data) {
  return request({
    baseURL: '',
    url: 'http://47.103.79.116:8765/hess/sys/hessbattery/delete',
    method: 'post',
    data: data
  })
}

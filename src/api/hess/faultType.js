import request from '@/utils/request'

export function hessFaultTypeDelete(data) {
  return request({
    url: '/sys/hessdictinfo/delete',
    method: 'post',
    data
  })
}

export function hessFaultTypeInfo(data) {
  return request({
    url: '/sys/hessdictinfo/info' + data,
    method: 'post',
    data
  })
}

export function hessFaultTypeList(data) {
  return request({
    url: '/sys/hessdictinfo/list',
    method: 'post',
    data
  })
}

export function hessFaultTypeSave(data) {
  return request({
    url: '/sys/hessdictinfo/save',
    method: 'post',
    data
  })
}

export function hessFaultTypeUpdate(data) {
  return request({
    url: '/sys/hessdictinfo/update',
    method: 'post',
    data
  })
}

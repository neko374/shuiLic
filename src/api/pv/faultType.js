import request from '@/utils/request'

export function pvFaultTypeDelete(data) {
  return request({
    url: '/sys/hessdictinfo/delete',
    method: 'post',
    data
  })
}

export function pvFaultTypeInfo(data) {
  return request({
    url: '/sys/hessdictinfo/info' + data,
    method: 'post',
    data
  })
}

export function pvFaultTypeList(data) {
  return request({
    url: '/sys/hessdictinfo/list',
    method: 'post',
    data
  })
}

export function pvFaultTypeSave(data) {
  return request({
    url: '/sys/hessdictinfo/save',
    method: 'post',
    data
  })
}

export function pvFaultTypeUpdate(data) {
  return request({
    url: '/sys/hessdictinfo/update',
    method: 'post',
    data
  })
}

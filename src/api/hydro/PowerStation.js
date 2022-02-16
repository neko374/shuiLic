import request from '@/utils/request'

export function hydroDelete(data) {
  return request({
    baseURL: hydroIp,
    url: '/sys/farmcfginfo/delete',
    method: 'post',
    data
  })
}

export function hydroInfo(data) {
  return request({
    baseURL: hydroIp,
    url: '/sys/farmcfginfo/info' + data,
    method: 'post',
    data
  })
}

export function hydroList(data) {
  return request({
    baseURL: hydroIp,
    url: '/sys/farmcfginfo/list',
    method: 'post',
    data
  })
}

export function hydroSave(data) {
  return request({
    baseURL: hydroIp,
    url: '/sys/farmcfginfo/save',
    method: 'post',
    data
  })
}

export function hydroUpdate(data) {
  return request({
    baseURL: hydroIp,
    url: '/sys/farmcfginfo/update',
    method: 'post',
    data
  })
}

import request from '@/utils/request'

export function hydroOrderProcessList(data) {
  return request({
    baseURL: hydroIp,
    url: '/sys/hessorderprocess/list',
    method: 'post',
    data: data
  })
}

export function hydroOrderProcessSave(data) {
  return request({
    baseURL: hydroIp,
    url: '/sys/hessorderprocess/save',
    method: 'post',
    data: data
  })
}

export function hydroOrderProcessUpdate(data) {
  return request({
    baseURL: hydroIp,
    url: '/sys/hessorderprocess/update',
    method: 'post',
    data: data
  })
}

export function hydroOrderProcessDelete(data) {
  return request({
    baseURL: hydroIp,
    url: '/sys/hessorderprocess/delete',
    method: 'post',
    data: data
  })
}

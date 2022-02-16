import request from '@/utils/request'

export function hessOrderProcessList(data) {
  return request({
    baseURL: hessIp,
    url: '/sys/hessorderprocess/list',
    method: 'post',
    data: data
  })
}

export function hessOrderProcessSave(data) {
  return request({
    baseURL: hessIp,
    url: '/sys/hessorderprocess/save',
    method: 'post',
    data: data
  })
}

export function hessOrderProcessUpdate(data) {
  return request({
    baseURL: hessIp,
    url: '/sys/hessorderprocess/update',
    method: 'post',
    data: data
  })
}

export function hessOrderProcessDelete(data) {
  return request({
    baseURL: hessIp,
    url: '/sys/hessorderprocess/delete',
    method: 'post',
    data: data
  })
}

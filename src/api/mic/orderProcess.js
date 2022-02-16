import request from '@/utils/request'

export function micOrderProcessList(data) {
  return request({
    baseURL: MicrogridIp,
    url: '/sys/hessorderprocess/list',
    method: 'post',
    data: data
  })
}

export function micOrderProcessSave(data) {
  return request({
    baseURL: MicrogridIp,
    url: '/sys/hessorderprocess/save',
    method: 'post',
    data: data
  })
}

export function micOrderProcessUpdate(data) {
  return request({
    baseURL: MicrogridIp,
    url: '/sys/hessorderprocess/update',
    method: 'post',
    data: data
  })
}

export function micOrderProcessDelete(data) {
  return request({
    baseURL: MicrogridIp,
    url: '/sys/hessorderprocess/delete',
    method: 'post',
    data: data
  })
}

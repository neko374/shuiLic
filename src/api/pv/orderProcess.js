import request from '@/utils/request'

export function pvOrderProcessList(data) {
  return request({
    url: '/sys/hessorderprocess/list',
    method: 'post',
    data: data
  })
}

export function pvOrderProcessSave(data) {
  return request({
    url: '/sys/hessorderprocess/save',
    method: 'post',
    data: data
  })
}

export function pvOrderProcessUpdate(data) {
  return request({
    url: '/sys/hessorderprocess/update',
    method: 'post',
    data: data
  })
}

export function pvOrderProcessDelete(data) {
  return request({
    url: '/sys/hessorderprocess/delete',
    method: 'post',
    data: data
  })
}

import request from '@/utils/request'

export function mqttprojectInfoDelete(data) {
  return request({
    url: '/sys/aipowerprojectinfo/delete',
    method: 'post',
    data
  })
}

export function mqttprojectInfoInfo(data) {
  return request({
    url: `/sys/aipowerprojectinfo/info/${data}`,
    method: 'post',
    data
  })
}

export function mqttprojectInfoList(data) {
  return request({
    url: '/sys/aipowerprojectinfo/list',
    method: 'post',
    data
  })
}

export function mqttprojectInfoSave(data) {
  return request({
    url: '/sys/aipowerprojectinfo/save',
    method: 'post',
    data
  })
}

export function mqttprojectInfoUpdate(data) {
  return request({
    url: '/sys/aipowerprojectinfo/update',
    method: 'post',
    data
  })
}

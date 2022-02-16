// 规约编辑人
import request from '@/utils/request'

export function mqttprojectCollectorDelete(data) {
  return request({
    baseURL: $_mqttIp,
    url: '/sys/aipowerprojectcollector/delete',
    method: 'post',
    data
  })
}

export function mqttprojectCollectorInfo(data) {
  return request({
    baseURL: $_mqttIp,
    url: `/sys/aipowerprojectcollector/info/${data}`,
    method: 'post',
    data
  })
}

export function mqttprojectCollectorList(data) {
  return request({
    baseURL: $_mqttIp,
    url: '/sys/aipowerprojectcollector/list',
    method: 'post',
    data
  })
}

export function mqttprojectCollectorSave(data) {
  return request({
    baseURL: $_mqttIp,
    url: '/sys/aipowerprojectcollector/save',
    method: 'post',
    data
  })
}

export function mqttprojectCollectorUpdate(data) {
  return request({
    baseURL: $_mqttIp,
    url: '/sys/aipowerprojectcollector/update',
    method: 'post',
    data
  })
}

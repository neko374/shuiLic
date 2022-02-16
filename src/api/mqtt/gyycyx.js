// 规约编辑人
import request from '@/utils/request'

export function mqttgyycyxDelete(data) {
  return request({
	  baseURL: $_mqttIp,
    url: '/sys/aipowermqttgyycyx/delete',
    method: 'post',
    data
  })
}

export function mqttgyycyxInfo(data) {
  return request({
	  baseURL: $_mqttIp,
    url: `/sys/aipowermqttgyycyx/info/${data}`,
    method: 'post',
    data
  })
}

export function mqttgyycyxList(data) {
  return request({
	  baseURL: $_mqttIp,
    url: '/sys/aipowermqttgyycyx/list',
    method: 'post',
    data
  })
}

export function mqttgyycyxSave(data) {
  return request({
	  baseURL: $_mqttIp,
    url: '/sys/aipowermqttgyycyx/save',
    method: 'post',
    data
  })
}

export function mqttgyycyxUpdate(data) {
  return request({
	  baseURL: $_mqttIp,
    url: '/sys/aipowermqttgyycyx/update',
    method: 'post',
    data
  })
}

export function mqttgyycyxBatchSave(data) {
  return request({
	  baseURL: $_mqttIp,
    url: '/sys/aipowermqttgyycyx/batchSave',
    method: 'post',
    data
  })
}

export function mqttgyycyxBatchUpdate(data) {
  return request({
	  baseURL: $_mqttIp,
    url: '/sys/aipowermqttgyycyx/batchUpdate',
    method: 'post',
    data
  })
}

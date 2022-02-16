// 规约编辑人
import request from '@/utils/request'

export function mqttgybitZtDelete(data) {
  return request({
	  baseURL: $_mqttIp,
    url: '/sys/aipowermqttgybitzt/delete',
    method: 'post',
    data
  })
}

export function mqttgybitZtInfo(data) {
  return request({
	  baseURL: $_mqttIp,
    url: `/sys/aipowermqttgybitzt/info/${data}`,
    method: 'post',
    data
  })
}

export function mqttgybitZtList(data) {
  return request({
	  baseURL: $_mqttIp,
    url: '/sys/aipowermqttgybitzt/list',
    method: 'post',
    data
  })
}

export function mqttgybitZtOnlyList(data) {
  return request({
	  baseURL: $_mqttIp,
    url: '/sys/aipowermqttgybitzt/onlyList',
    method: 'post',
    data
  })
}

export function mqttgybitZtSave(data) {
  return request({
	  baseURL: $_mqttIp,
    url: '/sys/aipowermqttgybitzt/save',
    method: 'post',
    data
  })
}

export function mqttgybitZtUpdate(data) {
  return request({
	  baseURL: $_mqttIp,
    url: '/sys/aipowermqttgybitzt/update',
    method: 'post',
    data
  })
}

export function mqttgybitZtBatchSave(data) {
  return request({
	  baseURL: $_mqttIp,
    url: '/sys/aipowermqttgybitzt/batchSave',
    method: 'post',
    data
  })
}

export function mqttgybitZtBatchUpdate(data) {
  return request({
	  baseURL: $_mqttIp,
    url: '/sys/aipowermqttgybitzt/batchUpdate',
    method: 'post',
    data
  })
}

export function mqttgybitZtGetCurZt(data) {
  return request({
	  baseURL: $_mqttIp,
    url: '/sys/aipowermqttgybitzt/getCurZt',
    method: 'post',
    data
  })
}

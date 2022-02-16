// 规约编辑人
import request from '@/utils/request'

export function mqttgybitAlarmDelete(data) {
  return request({
	  baseURL: $_mqttIp,
    url: '/sys/aipowermqttgybitalarm/delete',
    method: 'post',
    data
  })
}

export function mqttgybitAlarmInfo(data) {
  return request({
	  baseURL: $_mqttIp,
    url: `/sys/aipowermqttgybitalarm/info/${data}`,
    method: 'post',
    data
  })
}

export function mqttgybitAlarmList(data) {
  return request({
	  baseURL: $_mqttIp,
    url: '/sys/aipowermqttgybitalarm/list',
    method: 'post',
    data
  })
}

export function mqttgybitAlarmOnlyList(data) {
  return request({
	  baseURL: $_mqttIp,
    url: '/sys/aipowermqttgybitalarm/onlyList',
    method: 'post',
    data
  })
}

export function mqttgybitAlarmSave(data) {
  return request({
	  baseURL: $_mqttIp,
    url: '/sys/aipowermqttgybitalarm/save',
    method: 'post',
    data
  })
}

export function mqttgybitAlarmUpdate(data) {
  return request({
	  baseURL: $_mqttIp,
    url: '/sys/aipowermqttgybitalarm/update',
    method: 'post',
    data
  })
}

export function mqttgybitAlarmBatchSave(data) {
  return request({
	  baseURL: $_mqttIp,
    url: '/sys/aipowermqttgybitalarm/batchSave',
    method: 'post',
    data
  })
}

export function mqttgybitAlarmBatchUpdate(data) {
  return request({
	  baseURL: $_mqttIp,
    url: '/sys/aipowermqttgybitalarm/batchUpdate',
    method: 'post',
    data
  })
}

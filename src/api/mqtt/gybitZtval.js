// 规约编辑人
import request from '@/utils/request'

export function mqttgybitZtvalDelete(data) {
  return request({
	  baseURL: $_mqttIp,
    url: '/sys/aipowermqttgybitztval/delete',
    method: 'post',
    data
  })
}

export function mqttgybitZtvalInfo(data) {
  return request({
	  baseURL: $_mqttIp,
    url: `/sys/aipowermqttgybitztval/info/${data}`,
    method: 'post',
    data
  })
}

export function mqttgybitZtvalList(data) {
  return request({
	  baseURL: $_mqttIp,
    url: '/sys/aipowermqttgybitztval/list',
    method: 'post',
    data
  })
}

export function mqttgybitZtvalSave(data) {
  return request({
	  baseURL: $_mqttIp,
    url: '/sys/aipowermqttgybitztval/save',
    method: 'post',
    data
  })
}

export function mqttgybitZtvalUpdate(data) {
  return request({
	  baseURL: $_mqttIp,
    url: '/sys/aipowermqttgybitztval/update',
    method: 'post',
    data
  })
}


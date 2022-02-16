// 规约编辑人
import request from '@/utils/request'

export function mqttgyykytDelete(data) {
  return request({
	  baseURL: $_mqttIp,
    url: '/sys/aipowermqttgyykyt/delete',
    method: 'post',
    data
  })
}

export function mqttgyykytInfo(data) {
  return request({
	  baseURL: $_mqttIp,
    url: `/sys/aipowermqttgyykyt/info/${data}`,
    method: 'post',
    data
  })
}

export function mqttgyykytList(data) {
  return request({
	  baseURL: $_mqttIp,
    url: '/sys/aipowermqttgyykyt/list',
    method: 'post',
    data
  })
}

export function mqttgyykytSave(data) {
  return request({
	  baseURL: $_mqttIp,
    url: '/sys/aipowermqttgyykyt/save',
    method: 'post',
    data
  })
}

export function mqttgyykytUpdate(data) {
  return request({
	  baseURL: $_mqttIp,
    url: '/sys/aipowermqttgyykyt/update',
    method: 'post',
    data
  })
}

// 规约编辑人
import request from '@/utils/request'

export function mqttgysnInfoDelete(data) {
  return request({
	  baseURL: $_mqttIp,
    url: '/sys/aipowermqttgysninfo/delete',
    method: 'post',
    data
  })
}

export function mqttgysnInfoInfo(data) {
  return request({
	  baseURL: $_mqttIp,
    url: `/sys/aipowermqttgysninfo/info/${data}`,
    method: 'post',
    data
  })
}

export function mqttgysnInfoList(data) {
  return request({
	  baseURL: $_mqttIp,
    url: '/sys/aipowermqttgysninfo/list',
    method: 'post',
    data
  })
}

export function mqttgysnInfoSave(data) {
  return request({
	  baseURL: $_mqttIp,
    url: '/sys/aipowermqttgysninfo/save',
    method: 'post',
    data
  })
}

export function mqttgysnInfoUpdate(data) {
  return request({
	  baseURL: $_mqttIp,
    url: '/sys/aipowermqttgysninfo/update',
    method: 'post',
    data
  })
}

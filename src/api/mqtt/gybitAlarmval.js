// 规约编辑人
import request from '@/utils/request'

export function mqttgybitAlarmvalDelete(data) {
  return request({
	  baseURL: $_mqttIp,
    url: '/sys/aipowermqttgybitalarmval/delete',
    method: 'post',
    data
  })
}

export function mqttgybitAlarmvalInfo(data) {
  return request({
	  baseURL: $_mqttIp,
    url: `/sys/aipowermqttgybitalarmval/info/${data}`,
    method: 'post',
    data
  })
}

export function mqttgybitAlarmvalList(data) {
  return request({
	  baseURL: $_mqttIp,
    url: '/sys/aipowermqttgybitalarmval/list',
    method: 'post',
    data
  })
}

export function mqttgybitAlarmvalSave(data) {
  return request({
	  baseURL: $_mqttIp,
    url: '/sys/aipowermqttgybitalarmval/save',
    method: 'post',
    data
  })
}

export function mqttgybitAlarmvalUpdate(data) {
  return request({
	  baseURL: $_mqttIp,
    url: '/sys/aipowermqttgybitalarmval/update',
    method: 'post',
    data
  })
}


// 规约编辑人
import request from '@/utils/request'

export function mqttgysnAreaDelete(data) {
  return request({
    url: '/sys/aipowermqttgysnarea/delete',
    method: 'post',
    data
  })
}

export function mqttgysnAreaInfo(data) {
  return request({
    url: `/sys/aipowermqttgysnarea/info/${data}`,
    method: 'post',
    data
  })
}

export function mqttgysnAreaList(data) {
  return request({
    url: '/sys/aipowermqttgysnarea/list',
    method: 'post',
    data
  })
}

export function mqttgysnAreaSave(data) {
  return request({
    url: '/sys/aipowermqttgysnarea/save',
    method: 'post',
    data
  })
}

export function mqttgysnAreaUpdate(data) {
  return request({
    url: '/sys/aipowermqttgysnarea/update',
    method: 'post',
    data
  })
}

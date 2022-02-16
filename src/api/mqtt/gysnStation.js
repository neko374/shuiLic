// 规约编辑人
import request from '@/utils/request'

export function mqttgysnStationDelete(data) {
  return request({
    url: '/sys/aipowermqttgysnstation/delete',
    method: 'post',
    data
  })
}

export function mqttgysnStationInfo(data) {
  return request({
    url: `/sys/aipowermqttgysnstation/info/${data}`,
    method: 'post',
    data
  })
}

export function mqttgysnStationList(data) {
  return request({
    url: '/sys/aipowermqttgysnstation/list',
    method: 'post',
    data
  })
}

export function mqttgysnStationSave(data) {
  return request({
    url: '/sys/aipowermqttgysnstation/save',
    method: 'post',
    data
  })
}

export function mqttgysnStationUpdate(data) {
  return request({
    url: '/sys/aipowermqttgysnstation/update',
    method: 'post',
    data
  })
}

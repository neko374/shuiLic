// 规约编辑人
import request from '@/utils/request'

export function mqttgysnObjDelete(data) {
  return request({
    url: '/sys/aipowermqttgysnobj/delete',
    method: 'post',
    data
  })
}

export function mqttgysnObjInfo(data) {
  return request({
    url: `/sys/aipowermqttgysnobj/info/${data}`,
    method: 'post',
    data
  })
}

export function mqttgysnObjList(data) {
  return request({
    url: '/sys/aipowermqttgysnobj/list',
    method: 'post',
    data
  })
}

export function mqttgysnObjSave(data) {
  return request({
    url: '/sys/aipowermqttgysnobj/save',
    method: 'post',
    data
  })
}

export function mqttgysnObjUpdate(data) {
  return request({
    url: '/sys/aipowermqttgysnobj/update',
    method: 'post',
    data
  })
}

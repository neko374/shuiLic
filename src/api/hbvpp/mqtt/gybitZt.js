// 规约编辑人
import request from '@/utils/request'

export function mqttgybitZtDelete(data) {
  return request({
    url: '/sys/aipowermqttgybitzt/delete',
    method: 'post',
    data
  })
}

export function mqttgybitZtInfo(data) {
  return request({
    url: `/sys/aipowermqttgybitzt/info/${data}`,
    method: 'post',
    data
  })
}

export function mqttgybitZtList(data) {
  return request({
    // baseURL: mqttIp,
    url: '/sys/aipowermqttgybitzt/list',
    method: 'post',
    data
  })
}

export function mqttgybitZtSave(data) {
  return request({
    url: '/sys/aipowermqttgybitzt/save',
    method: 'post',
    data
  })
}

export function mqttgybitZtUpdate(data) {
  return request({
    url: '/sys/aipowermqttgybitzt/update',
    method: 'post',
    data
  })
}

export function mqttgybitZtBatchSave(data) {
  return request({
    url: '/sys/aipowermqttgybitzt/batchSave',
    method: 'post',
    data
  })
}

export function mqttgybitZtBatchUpdate(data) {
  return request({
    url: '/sys/aipowermqttgybitzt/batchUpdate',
    method: 'post',
    data
  })
}

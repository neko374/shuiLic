// 规约编辑人
import request from '@/utils/request'

export function mqttgyCreatorInfoDelete(data) {
  return request({
    url: '/sys/aipowergycreatorinfo/delete',
    method: 'post',
    data
  })
}

export function mqttgyCreatorInfoInfo(data) {
  return request({
    url: `/sys/aipowergycreatorinfo/info/${data}`,
    method: 'post',
    data
  })
}

export function mqttgyCreatorInfoList(data) {
  return request({
    url: '/sys/aipowergycreatorinfo/list',
    method: 'post',
    data
  })
}

export function mqttgyCreatorInfoSave(data) {
  return request({
    url: '/sys/aipowergycreatorinfo/save',
    method: 'post',
    data
  })
}

export function mqttgyCreatorInfoUpdate(data) {
  return request({
    url: '/sys/aipowergycreatorinfo/update',
    method: 'post',
    data
  })
}

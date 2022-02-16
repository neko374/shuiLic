// 规约编辑人
import request from '@/utils/request'

export function mqtthisdbNameDelete(data) {
  return request({
    url: '/sys/aipowerhisdbname/delete',
    method: 'post',
    data
  })
}

export function mqtthisdbNameInfo(data) {
  return request({
    url: `/sys/aipowerhisdbname/info/${data}`,
    method: 'post',
    data
  })
}

export function mqtthisdbNameList(data) {
  return request({
    url: '/sys/aipowerhisdbname/list',
    method: 'post',
    data
  })
}

export function mqtthisdbNameSave(data) {
  return request({
    url: '/sys/aipowerhisdbname/save',
    method: 'post',
    data
  })
}

export function mqtthisdbNameUpdate(data) {
  return request({
    url: '/sys/aipowerhisdbname/update',
    method: 'post',
    data
  })
}

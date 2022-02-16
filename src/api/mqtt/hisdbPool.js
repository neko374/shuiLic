// 规约编辑人
import request from '@/utils/request'

export function mqtthisdbPoolDelete(data) {
  return request({
    url: '/sys/aipowerhisdbpool/delete',
    method: 'post',
    data
  })
}

export function mqtthisdbPoolInfo(data) {
  return request({
    url: `/sys/aipowerhisdbpool/info/${data}`,
    method: 'post',
    data
  })
}

export function mqtthisdbPoolList(data) {
  return request({
    url: '/sys/aipowerhisdbpool/list',
    method: 'post',
    data
  })
}

export function mqtthisdbPoolSave(data) {
  return request({
    url: '/sys/aipowerhisdbpool/save',
    method: 'post',
    data
  })
}

export function mqtthisdbPoolUpdate(data) {
  return request({
    url: '/sys/aipowerhisdbpool/update',
    method: 'post',
    data
  })
}

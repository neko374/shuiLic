// 规约编辑人
import request from '@/utils/request'

export function mqttredisPoolDelete(data) {
  return request({
    url: '/sys/aipowerredispool/delete',
    method: 'post',
    data
  })
}

export function mqttredisPoolInfo(data) {
  return request({
    url: `/sys/aipowerredispool/info/${data}`,
    method: 'post',
    data
  })
}

export function mqttredisPoolList(data) {
  return request({
    url: '/sys/aipowerredispool/list',
    method: 'post',
    data
  })
}

export function mqttredisPoolSave(data) {
  return request({
    url: '/sys/aipowerredispool/save',
    method: 'post',
    data
  })
}

export function mqttredisPoolUpdate(data) {
  return request({
    url: '/sys/aipowerredispool/update',
    method: 'post',
    data
  })
}

export function mqttredisPoolValGet(data) {
  return request({
    url: '/sys/farmcfginfo/getGroupCurValRedis',
    method: 'post',
    data
  })
}

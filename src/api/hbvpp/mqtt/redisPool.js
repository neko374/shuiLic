// 规约编辑人
import request from '@/utils/request'

export function mqttredisPoolDelete(data) {
  return request({
	  baseURL: mqttIp,
    url: '/sys/aipowerredispool/delete',
    method: 'post',
    data
  })
}

export function mqttredisPoolInfo(data) {
  return request({
	  baseURL: mqttIp,
    url: `/sys/aipowerredispool/info/${data}`,
    method: 'post',
    data
  })
}

export function mqttredisPoolList(data) {
  return request({
	  baseURL: mqttIp,
    url: '/sys/aipowerredispool/list',
    method: 'post',
    data
  })
}

export function mqttredisPoolSave(data) {
  return request({
	  baseURL: mqttIp,
    url: '/sys/aipowerredispool/save',
    method: 'post',
    data
  })
}

export function mqttredisPoolUpdate(data) {
  return request({
	  baseURL: mqttIp,
    url: '/sys/aipowerredispool/update',
    method: 'post',
    data
  })
}

export function mqttredisPoolValGet(data) {
  return request({
	  baseURL: mqttIp,
    url: '/sys/farmcfginfo/getGroupCurValRedis',
    method: 'post',
    data
  })
}

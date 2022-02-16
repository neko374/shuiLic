// 规约编辑人
import request from '@/utils/request'

export function mqttsoeInfoDelete(data) {
  return request({
	  baseURL: $_mqttIp,
    url: '/sys/aipowersoecfginfo/delete',
    method: 'post',
    data
  })
}

export function mqttsoeInfoInfo(data) {
  return request({
	  baseURL: $_mqttIp,
    url: `/sys/aipowersoecfginfo/info/${data}`,
    method: 'post',
    data
  })
}

export function mqttsoeInfoList(data) {
  return request({
	  baseURL: $_mqttIp,
    url: '/sys/aipowersoecfginfo/list',
    method: 'post',
    data
  })
}

export function mqttsoeInfoSave(data) {
  return request({
	  baseURL: $_mqttIp,
    url: '/sys/aipowersoecfginfo/save',
    method: 'post',
    data
  })
}

export function mqttsoeInfoUpdate(data) {
  return request({
	  baseURL: $_mqttIp,
    url: '/sys/aipowersoecfginfo/update',
    method: 'post',
    data
  })
}


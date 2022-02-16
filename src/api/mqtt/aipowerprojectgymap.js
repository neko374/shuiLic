// 小规约
import request from '@/utils/request'

export function mqttProjectGyMapDelete(data) {
  return request({
	  baseURL: $_mqttIp,
    url: '/sys/aipowerprojectgymap/delete',
    method: 'post',
    data
  })
}

export function mqttProjectGyMapInfo(data) {
  return request({
	  baseURL: $_mqttIp,
    url: `/sys/aipowerprojectgymap/info/${data}`,
    method: 'post',
    data
  })
}

export function mqttProjectGyMapList(data) {
  return request({
	  baseURL: $_mqttIp,
    url: '/sys/aipowerprojectgymap/list',
    method: 'post',
    data
  })
}

export function mqttProjectGyMapSave(data) {
  return request({
	  baseURL: $_mqttIp,
    url: '/sys/aipowerprojectgymap/save',
    method: 'post',
    data
  })
}

export function mqttProjectGyMapUpdate(data) {
  return request({
	  baseURL: $_mqttIp,
    url: '/sys/aipowerprojectgymap/update',
    method: 'post',
    data
  })
}

export function mqttProjectGyMapComList(data) {
  return request({
	  baseURL: $_mqttIp,
    url: '/sys/aipowermqttgyycyx/comList',
    method: 'post',
    data
  })
}


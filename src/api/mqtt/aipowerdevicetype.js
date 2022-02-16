// 规约编辑人
import request from '@/utils/request'

export function mqttDeviceTypeDelete(data) {
  return request({
	  baseURL: $_mqttIp,
    url: '/sys/aipowerdevicetype/delete',
    method: 'post',
    data
  })
}

export function mqttDeviceTypeInfo(data) {
  return request({
	  baseURL: $_mqttIp,
    url: `/sys/aipowerdevicetype/info/${data}`,
    method: 'post',
    data
  })
}

export function mqttDeviceTypeList(data) {
  return request({
	  baseURL: $_mqttIp,
    url: '/sys/aipowerdevicetype/list',
    method: 'post',
    data
  })
}

export function mqttDeviceTypeSave(data) {
  return request({
	  baseURL: $_mqttIp,
    url: '/sys/aipowerdevicetype/save',
    method: 'post',
    data
  })
}

export function mqttDeviceTypeUpdate(data) {
  return request({
	  baseURL: $_mqttIp,
    url: '/sys/aipowerdevicetype/update',
    method: 'post',
    data
  })
}


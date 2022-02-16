// 规约编辑人
import request from '@/utils/request'

export function mqttDeviceInfoDelete(data) {
  return request({
	  baseURL: $_mqttIp,
    url: '/sys/aipowerdeviceinfo/delete',
    method: 'post',
    data
  })
}

export function mqttDeviceInfoInfo(data) {
  return request({
	  baseURL: $_mqttIp,
    url: `/sys/aipowerdeviceinfo/info/${data}`,
    method: 'post',
    data
  })
}

export function mqttDeviceInfoList(data) {
  return request({
	  baseURL: $_mqttIp,
    url: '/sys/aipowerdeviceinfo/list',
    method: 'post',
    data
  })
}

export function mqttDeviceInfoSave(data) {
  return request({
	  baseURL: $_mqttIp,
    url: '/sys/aipowerdeviceinfo/save',
    method: 'post',
    data
  })
}

export function mqttDeviceInfoUpdate(data) {
  return request({
	  baseURL: $_mqttIp,
    url: '/sys/aipowerdeviceinfo/update',
    method: 'post',
    data
  })
}

export function mqttDeviceInfoUpload(data) {
  return request({
	  baseURL: $_mqttIp,
    url: '/sys/aipowerprojectinfo/upload',
    method: 'post',
    data
  })
}

export function mqttDeviceInfoPortionList(data) {
  return request({
	  baseURL: $_mqttIp,
    url: '/sys/aipowerdeviceinfo/deviceRelationship',
    method: 'post',
    data
  })
}


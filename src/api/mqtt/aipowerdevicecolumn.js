// 规约编辑人
import request from '@/utils/request'

export function mqttDeviceColumnDelete(data) {
  return request({
	  baseURL: $_mqttIp,
    url: '/sys/aipowerdevicecolumn/delete',
    method: 'post',
    data
  })
}

export function mqttDeviceColumnInfo(data) {
  return request({
	  baseURL: $_mqttIp,
    url: `/sys/aipowerdevicecolumn/info/${data}`,
    method: 'post',
    data
  })
}

export function mqttDeviceColumnList(data) {
  return request({
	  baseURL: $_mqttIp,
    url: '/sys/aipowerdevicecolumn/list',
    method: 'post',
    data
  })
}

export function mqttDeviceColumnSave(data) {
  return request({
	  baseURL: $_mqttIp,
    url: '/sys/aipowerdevicecolumn/save',
    method: 'post',
    data
  })
}

export function mqttDeviceColumnUpdate(data) {
  return request({
	  baseURL: $_mqttIp,
    url: '/sys/aipowerdevicecolumn/update',
    method: 'post',
    data
  })
}


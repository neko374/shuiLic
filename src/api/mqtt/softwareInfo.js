// 规约编辑人
import request from '@/utils/request'

export function mqttsoftwareInfoDelete(data) {
  return request({
	  baseURL: $_mqttIp,
    url: '/sys/aipowersoftwareinfo/delete',
    method: 'post',
    data
  })
}

export function mqttsoftwareInfoInfo(data) {
  return request({
	  baseURL: $_mqttIp,
    url: `/sys/aipowersoftwareinfo/info/${data}`,
    method: 'post',
    data
  })
}

export function mqttsoftwareInfoList(data) {
  return request({
	  baseURL: $_mqttIp,
    url: '/sys/aipowersoftwareinfo/list',
    method: 'post',
    data
  })
}

export function mqttsoftwareInfoSave(data) {
  return request({
	  baseURL: $_mqttIp,
    url: '/sys/aipowersoftwareinfo/save',
    method: 'post',
    data
  })
}

export function mqttsoftwareInfoUpdate(data) {
  return request({
	  baseURL: $_mqttIp,
    url: '/sys/aipowersoftwareinfo/update',
    method: 'post',
    data
  })
}

export function mqttDownloadFile(data) {
  return request({
	  baseURL: $_mqttIp,
    url: '/sys/aipowersoftwareinfo/downloadFile',
    method: 'post',
    data
  })
}

export function mqttGetDownloadFiles(data) {
  return request({
	  baseURL: $_mqttIp,
    url: '/sys/aipowersoftwareinfo/getDownloadFiles',
    method: 'post',
    data
  })
}

export function mqttXmlNames(data) {
  return request({
	  baseURL: $_mqttIp,
    url: '/sys/aipowersoftwareinfo/xmlNames',
    method: 'post',
    data
  })
}

export function mqttXmlReader(data) {
  return request({
	  baseURL: $_mqttIp,
    url: `/sys/aipowersoftwareinfo/xmlReader?id=${data.id}&fileName=${data.fileName}`,
    method: 'post',
    data
  })
}

export function mqttXmlWriter(data) {
  return request({
	  baseURL: $_mqttIp,
    url: `/sys/aipowersoftwareinfo/xmlWriter?id=${data.id}&fileName=${data.fileName}`,
    method: 'post',
    data: data.content
  })
}

export function mqttXmlRestart(data) {
  return request({
	  baseURL: $_mqttIp,
    url: '/sys/aipowersoftwareinfo/restart',
    method: 'post',
    data
  })
}

export function mqttXmlParentNames(data) {
  return request({
	  baseURL: $_mqttIp,
    url: '/sys/aipowersoftwareinfo/XmlParentNames',
    method: 'post',
    data
  })
}

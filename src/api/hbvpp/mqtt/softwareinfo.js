import request from '@/utils/request'

export function mqttXmlNames(data) {
  return request({
	  baseURL: mqttIp,
    url: '/sys/aipowersoftwareinfo/xmlNames',
    method: 'post',
    data
  })
}

export function mqttXmlReader(data) {
  return request({
	  baseURL: mqttIp,
    url: `/sys/aipowersoftwareinfo/xmlReader?id=${data.id}&fileName=${data.fileName}`,
    method: 'post',
    data
  })
}

export function mqttXmlWriter(data) {
  return request({
	  baseURL: mqttIp,
    url: `/sys/aipowersoftwareinfo/xmlWriter?id=${data.id}&fileName=${data.fileName}`,
    method: 'post',
    data:data.content
  })
}

export function mqttXmlRestart(data) {
  return request({
	  baseURL: mqttIp,
    url: '/sys/aipowersoftwareinfo/restart',
    method: 'post',
    data
  })
}
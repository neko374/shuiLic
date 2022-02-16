// 规约编辑人
import request from '@/utils/request'

export function getYcePvWarn(data) {
  return request({
    baseURL: $_mqttIp,
    url: '/sys/ycepvwarn/list',
    method: 'post',
    data,
    timeout: $_downTime * 1000 + ''
  })
}

export function getYcePvWarnDynamics(data) {
  return request({
    baseURL: $_mqttIp,
    url: '/sys/ycepvwarn/dynamicsNamePage',
    method: 'post',
    data,
    timeout: $_downTime * 1000 + ''
  })
}

export function getYcePvWarnDynamicsList(data,timeout) {
  timeout = timeout || 8000
  return request({
    baseURL: $_mqttIp,
    url: '/sys/ycepvwarn/dynamicsNameList',
    method: 'post',
    data,
    timeout
  })
}

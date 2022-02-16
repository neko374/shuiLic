// 规约编辑人
import request from '@/utils/request'

export function getYcePvZt(data) {
  return request({
    baseURL: $_mqttIp,
    url: '/sys/ycepvzt/list',
    method: 'post',
    data,
    timeout: $_downTime * 1000 + ''
  })
}

export function getYcePvZtDynamics(data) {
  return request({
    baseURL: $_mqttIp,
    url: '/sys/ycepvzt/dynamicsNamePage',
    method: 'post',
    data,
    timeout: $_downTime * 1000 + ''
  })
}

export function getYcePvZtDynamicsList(data,timeout) {
  timeout = timeout || 8000
  return request({
    baseURL: $_mqttIp,
    url: '/sys/ycepvzt/dynamicsNameList',
    method: 'post',
    data,
    timeout
  })
}
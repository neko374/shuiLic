// 规约编辑人
import request from '@/utils/request'

export function modbusgyykytDelete(data) {
  return request({
    url: '/sys/aipowermodbusgyykyt/delete',
    method: 'post',
    data
  })
}

export function modbusgyykytInfo(data) {
  return request({
    url: `/sys/aipowermodbusgyykyt/info/${data}`,
    method: 'post',
    data
  })
}

export function modbusgyykytList(data) {
  return request({
    url: '/sys/aipowermodbusgyykyt/list',
    method: 'post',
    data
  })
}

export function modbusgyykytSave(data) {
  return request({
    url: '/sys/aipowermodbusgyykyt/save',
    method: 'post',
    data
  })
}

export function modbusgyykytUpdate(data) {
  return request({
    url: '/sys/aipowermodbusgyykyt/update',
    method: 'post',
    data
  })
}

import request from '@/utils/request'

export function pvAlarmDelete(data) {
  return request({
    url: '/sys/pvrunalarm2019/delete',
    method: 'post',
    data: data
  })
}

export function pvAlarmInfo(data) {
  return request({
    url: '/sys/pvrunalarm2019/info/' + data,
    method: 'post',
    data: data
  })
}

export function pvAlarmList(data) {
  return request({
    url: '/sys/pvrunalarm2019/list',
    method: 'post',
    data: data
  })
}

export function pvAlarmSave(data) {
  return request({
    url: '/sys/pvrunalarm2019/save',
    method: 'post',
    data: data
  })
}

export function pvAlarmUpdate(data) {
  return request({
    url: '/sys/pvrunalarm2019/update',
    method: 'post',
    data: data
  })
}


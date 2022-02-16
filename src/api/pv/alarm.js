import request from '@/utils/request'

export function pvAlarmList(data) {
  return request({
    url: '/sys/pvrunalarm2019/list',
    method: 'post',
    data
  })
}

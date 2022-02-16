import request from '@/utils/request'

export function hydroAlarmList(data) {
  return request({
    baseURL: hydroIp,
    url: '/sys/hydrorunalarm2019/list',
    method: 'post',
    data
  })
}

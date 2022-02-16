// 规约编辑人
import request from '@/utils/request'

export function getDeviceAlarm(data) {
  return request({
    url: '/sys/ycepvwarn/list',
    method: 'post',
    data
  })
}

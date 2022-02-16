
import request from '@/utils/request'

export function micRunData(data) {
  return request({
    baseURL: MicrogridIp,
    url: '/sys/chart/runData',
    method: 'post',
    data
  })
}

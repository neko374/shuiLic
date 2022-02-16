import request from '@/utils/request'

export function getHydroChart(data) {
  return request({
    baseURL: hydroIp,
    url: '/sys/chart/runData',
    method: 'post',
    data
  })
}
